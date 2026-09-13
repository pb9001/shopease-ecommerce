const express = require("express");

const Return = require("../models/Return");
const Order = require("../models/Order");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// CREATE RETURN REQUEST - USER
router.post(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      // Admin cannot create return requests
      if (req.user.role !== "user") {
        return res.status(403).json({
          message: "Only users can request returns",
        });
      }

      const { orderId, reason } = req.body;

      // Validate required fields
      if (!orderId || !reason) {
        return res.status(400).json({
          message: "Order ID and return reason are required",
        });
      }

      // Check whether the order exists
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      // Make sure the order belongs to the logged-in user
      if (order.user.toString() !== req.user.id) {
        return res.status(403).json({
          message: "You can only request a return for your own order",
        });
      }

      // Returns are allowed only for delivered orders
      if (order.status !== "Delivered") {
        return res.status(400).json({
          message:
            "Returns can only be requested for delivered orders",
        });
      }

      // Check whether a return already exists
      const existingReturn = await Return.findOne({
        order: orderId,
      });

      if (existingReturn) {
        return res.status(400).json({
          message: "A return request already exists for this order",
        });
      }

      // Create return request
      const returnRequest = await Return.create({
        order: orderId,
        user: req.user.id,
        reason,
        status: "Pending",
      });

      res.status(201).json({
        message: "Return request created successfully",
        returnRequest,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to create return request",
        error: error.message,
      });
    }
  }
);

// GET USER RETURNS
router.get(
  "/my-returns",
  authMiddleware,
  async (req, res) => {
    try {
      const returns = await Return.find({
        user: req.user.id,
      })
        .populate("order")
        .sort({
          createdAt: -1,
        });

      res.json({
        returns,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch return requests",
        error: error.message,
      });
    }
  }
);

// GET ALL RETURNS - ADMIN
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const returns = await Return.find()
        .populate("user", "name email")
        .populate("order")
        .sort({
          createdAt: -1,
        });

      res.json({
        returns,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch return requests",
        error: error.message,
      });
    }
  }
);

// UPDATE RETURN STATUS - ADMIN
router.put(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status, adminNote } = req.body;

      const allowedStatuses = [
        "Approved",
        "Rejected",
      ];

      // Validate status
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid return status",
        });
      }

      // Find return request
      const returnRequest = await Return.findById(
        req.params.id
      );

      if (!returnRequest) {
        return res.status(404).json({
          message: "Return request not found",
        });
      }

      // Update status
      returnRequest.status = status;

      // Update admin note if provided
      if (adminNote !== undefined) {
        returnRequest.adminNote = adminNote;
      }

      await returnRequest.save();

      // Fetch updated return with customer and order details
      const updatedReturn = await Return.findById(
        returnRequest._id
      )
        .populate("user", "name email")
        .populate("order");

      res.json({
        message: `Return request ${status.toLowerCase()} successfully`,
        returnRequest: updatedReturn,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update return request",
        error: error.message,
      });
    }
  }
);

module.exports = router;