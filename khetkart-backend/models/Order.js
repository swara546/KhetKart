// models/Order.js
// Defines what an "Order" document looks like in MongoDB

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name:  { type: String },
        price: { type: Number },
        qty:   { type: Number },
        unit:  { type: String },
      },
    ],
    subtotal: { type: Number, required: true },
    delivery: { type: Number, default: 0 },
    total:    { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    // Track every status change with timestamp
    statusHistory: [
      {
        status:    { type: String },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);