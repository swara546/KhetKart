// server.js
// Main entry point — starts the Express server

const express   = require("express");
const cors      = require("cors");
const dotenv    = require("dotenv");
const connectDB = require("./config/db");

// Load .env variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// ── Middleware ───────────────────────────────────────────────────

// Allow requests from our React frontend
app.use(cors({
  origin: "http://localhost:5173", // Vite default port
  credentials: true,
}));

// Parse incoming JSON request bodies
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────
app.use("/api/auth",     require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders",   require("./routes/orders"));
app.use("/api/seller",   require("./routes/seller"));

// ── Health check ─────────────────────────────────────────────────
// Visit http://localhost:5000/api/health to check if server is running
app.get("/api/health", (req, res) => {
  res.json({ status: "✅ KhetKart backend is running!" });
});

// ── 404 handler ──────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// ── Start server ─────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
