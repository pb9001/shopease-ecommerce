const express = require("express");

const Order = require("../models/Order");

const authMiddleware = require("../middleware/authMiddleware");

const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// CREATE ORDER - USER
router.post(
  "/",
  authMiddleware,
  async (req, res) => {

    if (req.user.role !== "user") {
  return res.status(403).json({
    message: "Only users can place orders",
  });
}

    try {
      const {
        items,
        subtotal,
        discount,
        deliveryCharge,
        totalAmount,
        paymentMethod,
        shippingAddress,
      } = req.body;

      if (
        !items ||
        items.length === 0 ||
        subtotal === undefined ||
        totalAmount === undefined ||
        !shippingAddress
      ) {
        return res.status(400).json({
          message: "Required order details are missing",
        });
      }

      if (paymentMethod !== "cod") {
        return res.status(400).json({
          message: "Only Cash on Delivery is available",
        });
      }

      const order = await Order.create({
        user: req.user.id,
        items,
        subtotal,
        discount: discount || 0,
        deliveryCharge: deliveryCharge || 0,
        totalAmount,
        paymentMethod: "cod",
        paymentStatus: "Pending",
        status: "Confirmed",
        shippingAddress,
      });

      res.status(201).json({
        message: "Order placed successfully",
        order,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to place order",
        error: error.message,
      });
    }
  }
);

// GET USER ORDERS
router.get(
  "/my-orders",
  authMiddleware,
  async (req, res) => {
    try {
      const orders = await Order.find({
        user: req.user.id,
      }).sort({
        createdAt: -1,
      });

      res.json({
        orders,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch orders",
        error: error.message,
      });
    }
  }
);

// GET ALL ORDERS - ADMIN
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const orders = await Order.find()
        .populate("user", "name email")
        .sort({
          createdAt: -1,
        });

      res.json({
        orders,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch all orders",
        error: error.message,
      });
    }
  }
);

// UPDATE ORDER STATUS - ADMIN
router.put(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid order status",
        });
      }

      const order = await Order.findById(
        req.params.id
      );

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      order.status = status;

      await order.save();

      // Fetch updated order with customer details
      const updatedOrder = await Order.findById(
        order._id
      ).populate("user", "name email");

      res.json({
        message: "Order status updated successfully",
        order: updatedOrder,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update order status",
        error: error.message,
      });
    }
  }
);

module.exports = router;