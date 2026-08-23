const User = require("../models/User");
const { verifyToken } = require("../utils/jwt");

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.id).select("role tokenVersion");

        if (!user || user.tokenVersion !== decoded.tokenVersion) {
            return res.status(401).json({ message: "Session expired, please log in again" });
        }

        req.user = { id: user._id.toString(), role: user.role };
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;
