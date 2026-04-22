// routes/profile.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");

// GET /api/profile
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch {
    res.status(500).json({ message: "Server error." });
  }
});

// PUT /api/profile — update name and village
router.put("/", protect, async (req, res) => {
  try {
    const { name, village } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, village },
      { new: true }
    ).select("-password");

    // ── Fix 1: If farmer, update sellerName on all their products ──
    if (user.role === "farmer") {
      await Product.updateMany(
        { seller: req.user._id },
        { sellerName: name }
      );
    }

    res.json(user);
  } catch {
    res.status(500).json({ message: "Server error." });
  }
});

// PUT /api/profile/password — change password
router.put("/password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect." });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully!" });
  } catch {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;