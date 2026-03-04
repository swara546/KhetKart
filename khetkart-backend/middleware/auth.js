// middleware/auth.js
// Protects routes — only logged-in users can access them
// Works like a security guard that checks your token before letting you in

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    // 1. Check if token exists in request headers
    // Frontend sends: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not logged in. Please login first." });
    }

    // 2. Extract the token (remove "Bearer " prefix)
    const token = authHeader.split(" ")[1];

    // 3. Verify the token is valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find the user from DB and attach to request
    req.user = await User.findById(decoded.id).select("-password"); // don't send password

    if (!req.user) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    next(); // ✅ token is valid, proceed to the actual route

  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token. Please login again." });
  }
};

// Extra middleware — only sellers can access certain routes
const sellerOnly = (req, res, next) => {
  if (req.user && req.user.role === "seller") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Sellers only." });
  }
};

module.exports = { protect, sellerOnly };
