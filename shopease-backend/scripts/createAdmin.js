const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(
      "mongodb://127.0.0.1:27017/ecommerce"
    );

    console.log("MongoDB connected");

    const existingAdmin = await User.findOne({
      email: "admin@shopease.com",
    });

    if (existingAdmin) {
      console.log("Admin account already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      "admin123",
      10
    );

    const admin = await User.create({
      name: "ShopEase Admin",
      email: "admin@shopease.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin account created successfully");
    console.log("Email:", admin.email);
    console.log("Role:", admin.role);

    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error.message);
    process.exit(1);
  }
};

createAdmin();