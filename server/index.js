const express = require("express");
const cors = require("cors");
const connectDB = require("./database/db");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const userRoutes = require("./routes/user.routes");
const orderRoutes = require("./routes/order.routes");
const app = express();
require("dotenv").config();

const path = require("path");

const cookieParser = require("cookie-parser");

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

const seedAdmin = require("./utils/seedAdmin");

connectDB().then(() => {
  seedAdmin();
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
