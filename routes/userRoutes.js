// ============================
// routes/userRoutes.js - User Routes
// ============================

const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ---- POST /users - Create a new user ----
router.post("/", async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;

    // Basic validation: name and email are required
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "A user with this email already exists" });
    }

    // Create and save the new user
    const user = new User({ name, email, role, isActive });
    await user.save();

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    // Handle Mongoose validation errors (e.g., invalid role enum)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    res.status(500).json({ error: error.message });
  }
});

// ---- GET /users - Get all users ----
router.get("/", async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from DB
    res.json({
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;