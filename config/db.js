// ============================
// config/db.js - MongoDB Connection
// ============================

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Connect using the URI from .env
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    // Exit process if DB connection fails
    process.exit(1);
  }
};

module.exports = connectDB;