// ============================
// models/Record.js - Financial Record Schema
// ============================

const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be a positive number"],
    },

    // Whether this is money coming in or going out
    type: {
      type: String,
      enum: ["income", "expense"], // Only these 2 values allowed
      required: [true, "Type is required (income or expense)"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      // Examples: Salary, Rent, Food, Investment, etc.
    },

    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Record", recordSchema);