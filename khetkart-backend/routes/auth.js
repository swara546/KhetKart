// routes/auth.js
// Handles: POST /api/auth/register  and  POST /api/auth/login
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, mobile, village, role, password } = req.body;

    if (await User.findOne({ mobile }))
      return res.status(400).json({ message: "Mobile number already registered." });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, mobile, village, role, password: hashed });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // ✅ Never send password back
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        village: user.village,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const user = await User.findOne({ mobile });
    if (!user)
      return res.status(400).json({ message: "Mobile number not registered." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // ✅ Never send password back
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        village: user.village,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;