// models/User.js
// Defines what a "User" document looks like in MongoDB

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      unique: true,                          // no two users with same mobile
      match: [/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"],
    },
    village: {
      type: String,
      required: [true, "Village/City is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["customer", "seller"],          // only these two roles allowed
      default: "customer",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      // ⚠️ We NEVER store plain passwords — always hashed with bcrypt
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("User", userSchema);
