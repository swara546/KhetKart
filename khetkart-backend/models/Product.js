// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Crop name is required"],
      trim: true,
    },
    description: { type: String, default: "" },
    price: {
      type: Number,
      required: [true, "Price per unit is required"],
      min: [0, "Price cannot be negative"],
    },
    unit: {
      type: String,
      default: "kg",          // most crops sold per kg
    },
    category: {
      type: String,
      required: true,
      enum: ["Grains", "Vegetables", "Fruits", "Pulses"],
    },
    image:    { type: String, default: "" },
    stock:    { type: Number, default: 0 },   // quantity available in kg/unit
    minOrder: { type: Number, default: 1 },   // minimum order quantity
    rating:   { type: Number, default: 0, min: 0, max: 5 },

    // The farmer who listed this crop
    seller:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sellerName: { type: String, default: "" },  // farmer's name for quick display
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);