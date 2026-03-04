// routes/auth.js
// Handles: POST /api/auth/register  and  POST /api/auth/login

const express = require("express");
const router  = express.Router();
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const User    = require("../models/User");

// ── Helper: generate JWT token ───────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ────────────────────────────────────────────────────────────────
// POST /api/auth/register
// Body: { name, mobile, village, role, password }
// ────────────────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, mobile, village, role, password } = req.body;

    // 1. Check all fields are present
    if (!name || !mobile || !village || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // 2. Check if mobile already registered
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(409).json({ message: "Mobile number already registered." });
    }

    // 3. Hash the password (never store plain text!)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create and save user
    const user = await User.create({
      name,
      mobile,
      village,
      role: role || "customer",
      password: hashedPassword,
    });

    // 5. Return success with token
    res.status(201).json({
      message: "Registration successful!",
      token: generateToken(user._id),
      user: {
        _id:     user._id,
        name:    user.name,
        mobile:  user.mobile,
        village: user.village,
        role:    user.role,
      },
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Body: { mobile, password }
// ────────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;

    // 1. Check fields
    if (!mobile || !password) {
      return res.status(400).json({ message: "Mobile and password are required." });
    }

    // 2. Find user by mobile
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: "No account found with this mobile number." });
    }

    // 3. Compare password with hashed version
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    // 4. Return token + user info
    res.status(200).json({
      message: "Login successful!",
      token: generateToken(user._id),
      user: {
        _id:     user._id,
        name:    user.name,
        mobile:  user.mobile,
        village: user.village,
        role:    user.role,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
