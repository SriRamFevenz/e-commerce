const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

exports.register = async (req, res) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ id: user._id, role: user.role });
    const { logger, authLogger } = require("../utils/logger");

    // Log all logins
    authLogger.info({
      message: 'User Login',
      userId: user._id,
      email: user.email,
      role: user.role,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString()
    });

    if (user.role === 'admin') {
      // Check for Office IP restriction
      if (process.env.OFFICE_IP && process.env.OFFICE_IP !== req.ip) {
        logger.warn({
          message: 'Admin Login Blocked - Invalid IP',
          userId: user._id,
          email: user.email,
          ip: req.ip,
          expectedIp: process.env.OFFICE_IP,
          userAgent: req.headers['user-agent'],
          timestamp: new Date().toISOString()
        });
        return res.status(403).json({ message: "Access denied: Invalid IP address" });
      }

      logger.info({
        message: 'Admin Login',
        userId: user._id,
        email: user.email,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString()
      });
    }

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: "Logged out successfully" });
};
