require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const returnRoutes = require("./routes/returnRoutes");

const app = express();

const PORT = 5000;

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/returns", returnRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "ShopEase Backend is running",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(
    `ShopEase Backend running on port ${PORT}`
  );
});