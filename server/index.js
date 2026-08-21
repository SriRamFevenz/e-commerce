require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");

const connectDB = require("./database/db");
const { apiLimiter } = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error("FATAL: JWT_SECRET must be set and be at least 32 characters long.");
  process.exit(1);
}

const app = express();

// Required so req.ip reflects the real client IP behind a reverse proxy
app.set("trust proxy", 1);

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(logsDir, 'server.log'), { flags: 'a' });

// Log to console
app.use(morgan('dev'));

// Log to file
app.use(morgan('combined', { stream: accessLogStream }));

// Apply rate limiting to all API routes
app.use("/api", apiLimiter);

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/upload", require("./routes/upload.routes"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Central error handler - must be registered last
app.use(errorHandler);

const seedAdmin = require("./utils/seedAdmin");

connectDB().then(() => {
  seedAdmin();
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Graceful shutdown
const shutdown = () => {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
