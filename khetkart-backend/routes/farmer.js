// routes/farmer.js
// Farmer dashboard routes — only accessible by logged-in farmers

const express = require("express");
const router  = express.Router();
const Product = require("../models/Product");
const Order   = require("../models/Order");
const { protect, farmerOnly } = require("../middleware/auth");

router.use(protect, farmerOnly);

// GET /api/farmer/products — farmer sees only their own crop listings
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch {
    res.status(500).json({ message: "Server error." });
  }
});

// GET /api/farmer/orders — orders placed for this farmer's crops
router.get("/orders", async (req, res) => {
  try {
    const myOrders = await Order.find({ farmer: req.user._id })
      .populate("customer", "name mobile village")
      .sort({ createdAt: -1 });

    res.status(200).json(myOrders);
  } catch {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;