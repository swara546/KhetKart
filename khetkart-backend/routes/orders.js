// routes/orders.js
// POST /api/orders          → place an order (customers only)
// GET  /api/orders/mine     → get my orders (logged-in customer)
// GET  /api/orders          → get all orders (sellers see orders for their products)

const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect, farmerOnly } = require("../middleware/auth");

const VALID_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

// POST /api/orders — vendor places an order
// Stock is NOT reduced here — only when farmer confirms
router.post("/", protect, async (req, res) => {
  try {
    const { items, subtotal, delivery, total } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ message: "No items in order." });

    // Validate minOrder + check stock availability (but don't reduce yet)
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res.status(404).json({ message: `Product "${item.name}" not found.` });

      const orderedQty = Number(item.qty);

      if (product.minOrder && orderedQty < Number(product.minOrder))
        return res.status(400).json({
          message: `Minimum order for "${product.name}" is ${product.minOrder} ${product.unit || "kg"}.`,
        });

      if (Number(product.stock) < orderedQty)
        return res.status(400).json({
          message: `Only ${product.stock} ${product.unit || "kg"} of "${product.name}" available.`,
        });
    }

    // Create order with pending status — stock unchanged
    const order = await Order.create({
      customer: req.user._id,
      items, subtotal, delivery, total,
      status: "pending",
      statusHistory: [{ status: "pending", updatedAt: new Date() }],
    });

    res.status(201).json({ message: "Order placed successfully! 🎉", order });
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// GET /api/orders/mine — vendor sees their own orders
router.get("/mine", protect, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch {
    res.status(500).json({ message: "Server error." });
  }
});

// GET /api/orders — all orders
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name mobile village")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch {
    res.status(500).json({ message: "Server error." });
  }
});

// PATCH /api/orders/:id/status — farmer updates order status
router.patch("/:id/status", protect, farmerOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status))
      return res.status(400).json({ message: "Invalid status." });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    // Verify farmer owns a product in this order
    const myProducts = await Product.find({ seller: req.user._id }).select("_id");
    const myProductIds = myProducts.map((p) => p._id.toString());
    const belongs = order.items.some((item) =>
      myProductIds.includes(item.productId?.toString())
    );
    if (!belongs)
      return res.status(403).json({ message: "You can only update orders for your own crops." });

    const previousStatus = order.status;

    // ── Stock logic ──────────────────────────────────────────────
    // confirmed → reduce stock (farmer has committed to fulfilling)
    if (status === "confirmed" && previousStatus === "pending") {
      for (const item of order.items) {
        const updated = await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -Number(item.qty) } },
          { new: true }
        );
        console.log(`✅ Stock reduced: ${item.name} → remaining: ${updated?.stock}`);
      }
    }

    // cancelled from confirmed/shipped → restore stock
    if (status === "cancelled" && ["confirmed", "shipped"].includes(previousStatus)) {
      for (const item of order.items) {
        const updated = await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: Number(item.qty) } },
          { new: true }
        );
        console.log(`♻️ Stock restored: ${item.name} → back to: ${updated?.stock}`);
      }
    }

    // cancelled from pending → no stock change needed (was never reduced)

    order.status = status;
    order.statusHistory = [...(order.statusHistory || []), { status, updatedAt: new Date() }];
    await order.save();

    res.json({ message: `Order marked as ${status}!`, order });
  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;