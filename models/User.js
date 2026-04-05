// ============================
// models/User.js - User Schema
// ============================

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,        // No two users can have same email
      lowercase: true,
      trim: true,
    },

    // Role controls what the user can do
    role: {
      type: String,
      enum: ["viewer", "analyst", "admin"], // Only these 3 values allowed
      default: "viewer",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("User", userSchema);