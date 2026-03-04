// routes/orders.js
// POST /api/orders          → place an order (customers only)
// GET  /api/orders/mine     → get my orders (logged-in customer)
// GET  /api/orders          → get all orders (sellers see orders for their products)

const express = require("express");
const router  = express.Router();
const Order   = require("../models/Order");
const { protect } = require("../middleware/auth");

// ────────────────────────────────────────────────────────────────
// POST /api/orders
// Protected — logged-in customers place orders
// Body: { items: [{ productId, name, price, qty, unit }], subtotal, delivery, total }
// ────────────────────────────────────────────────────────────────
router.post("/", protect, async (req, res) => {
  try {
    const { items, subtotal, delivery, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order." });
    }

    const order = await Order.create({
      customer: req.user._id,
      items,
      subtotal,
      delivery,
      total,
      status: "pending",
    });

    res.status(201).json({ message: "Order placed successfully! 🎉", order });

  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// ────────────────────────────────────────────────────────────────
// GET /api/orders/mine
// Protected — customer sees their own order history
// ────────────────────────────────────────────────────────────────
router.get("/mine", protect, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

// ────────────────────────────────────────────────────────────────
// GET /api/orders
// Protected — get all orders (for admin/seller dashboard use)
// ────────────────────────────────────────────────────────────────
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name mobile village") // join user info
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
