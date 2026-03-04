// routes/seller.js
// GET /api/seller/products   → seller sees only their own products
// GET /api/seller/orders     → seller sees orders containing their products

const express = require("express");
const router  = express.Router();
const Product = require("../models/Product");
const Order   = require("../models/Order");
const { protect, sellerOnly } = require("../middleware/auth");

// Both routes require login + seller role
router.use(protect, sellerOnly);

// ────────────────────────────────────────────────────────────────
// GET /api/seller/products
// Returns only the products added by this seller
// ────────────────────────────────────────────────────────────────
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

// ────────────────────────────────────────────────────────────────
// GET /api/seller/orders
// Returns orders that contain at least one product from this seller
// ────────────────────────────────────────────────────────────────
router.get("/orders", async (req, res) => {
  try {
    // Find this seller's product IDs first
    const myProducts = await Product.find({ seller: req.user._id }).select("_id");
    const myProductIds = myProducts.map((p) => p._id.toString());

    // Find orders where any item's productId is in seller's products
    const allOrders = await Order.find()
      .populate("customer", "name mobile village")
      .sort({ createdAt: -1 });

    const myOrders = allOrders.filter((order) =>
      order.items.some((item) => myProductIds.includes(item.productId?.toString()))
    );

    res.status(200).json(myOrders);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
