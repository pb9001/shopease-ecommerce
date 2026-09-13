const express = require("express");

const Product = require("../models/Product");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ==============================
// GET ALL PRODUCTS
// ==============================

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const products = await Product.find().sort({
        createdAt: -1,
      });

      res.json({
        products,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch products",
        error: error.message,
      });
    }
  }
);


// ==============================
// ADD PRODUCT
// ==============================

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        name,
        price,
        category,
        stock,
        image,
        description,
      } = req.body;

      if (
        !name ||
        price === undefined ||
        !category ||
        stock === undefined
      ) {
        return res.status(400).json({
          message:
            "Name, price, category and stock are required",
        });
      }

      const product = await Product.create({
        name,
        price,
        category,
        stock,
        image: image || "",
        description: description || "",
      });

      res.status(201).json({
        message: "Product added successfully",
        product,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to add product",
        error: error.message,
      });
    }
  }
);


// ==============================
// UPDATE PRODUCT
// ==============================

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        name,
        price,
        category,
        stock,
        image,
        description,
      } = req.body;

      const product = await Product.findById(
        req.params.id
      );

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      product.name = name ?? product.name;
      product.price = price ?? product.price;
      product.category = category ?? product.category;
      product.stock = stock ?? product.stock;
      product.image = image ?? product.image;
      product.description =
        description ?? product.description;

      await product.save();

      res.json({
        message: "Product updated successfully",
        product,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update product",
        error: error.message,
      });
    }
  }
);


// ==============================
// DELETE PRODUCT
// ==============================

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const product = await Product.findById(
        req.params.id
      );

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      await Product.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message: "Product deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to delete product",
        error: error.message,
      });
    }
  }
);


module.exports = router;