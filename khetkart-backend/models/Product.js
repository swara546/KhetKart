// models/Product.js
// Defines what a "Product" document looks like in MongoDB

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    unit: {
      type: String,
      default: "unit",   // e.g. kg, pack, piece, 1L
    },
    category: {
      type: String,
      required: true,
      enum: ["Seeds", "Fertilizers", "Tools", "Pesticides"],
    },
    image: {
      type: String,
      default: "",       // URL of product image (optional)
    },
    stock: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    brand: {
      type: String,
      default: "",
    },
    // which seller added this product
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",       // links to the User model
      required: true,
    },
    sellerName: {
      type: String,      // store seller name directly for easy display
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
