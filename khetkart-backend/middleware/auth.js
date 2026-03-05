// middleware/auth.js
const jwt  = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not logged in. Please login first." });
    }
    const token   = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user      = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "User no longer exists." });
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token. Please login again." });
  }
};

// Only farmers can list/manage crops
const farmerOnly = (req, res, next) => {
  if (req.user && req.user.role === "farmer") return next();
  res.status(403).json({ message: "Access denied. Farmers only." });
};

// Only vendors can place orders
const vendorOnly = (req, res, next) => {
  if (req.user && req.user.role === "vendor") return next();
  res.status(403).json({ message: "Access denied. Vendors only." });
};

module.exports = { protect, farmerOnly, vendorOnly };