// models/Order.js
// Defines what an "Order" document looks like in MongoDB

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // who placed this order
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // list of products ordered
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name:  { type: String },   // snapshot of name at time of order
        price: { type: Number },   // snapshot of price at time of order
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
