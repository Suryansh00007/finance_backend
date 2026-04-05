// ============================
// routes/recordRoutes.js - Financial Record Routes
// ============================

const express = require("express");
const router = express.Router();
const Record = require("../models/Record");
const { adminOnly, analystOrAdmin } = require("../middleware/roleMiddleware");

// ---- POST /records - Create a new financial record (Admin only) ----
router.post("/", adminOnly, async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    // Validate required fields
    if (!amount || !type || !category) {
      return res.status(400).json({
        error: "amount, type, and category are required fields",
      });
    }

    // Validate amount is a positive number
    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ error: "amount must be a positive number" });
    }

    const record = new Record({ amount, type, category, date, notes });
    await record.save();

    res.status(201).json({
      message: "Record created successfully",
      record,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    res.status(500).json({ error: error.message });
  }
});

// ---- GET /records - Get all records (Admin + Analyst) ----
router.get("/", analystOrAdmin, async (req, res) => {
  try {
    // Optional: filter by type using query param ?type=income or ?type=expense
    const filter = {};
    if (req.query.type) {
      filter.type = req.query.type;
    }

    const records = await Record.find(filter).sort({ date: -1 }); // Latest first
    res.json({
      count: records.length,
      records,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---- PUT /records/:id - Update a record (Admin only) ----
router.put("/:id", adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find record by ID and update it; { new: true } returns the updated document
    const record = await Record.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true, // Ensures enum/min validations run on update too
    });

    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.json({
      message: "Record updated successfully",
      record,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid record ID format" });
    }
    res.status(500).json({ error: error.message });
  }
});

// ---- DELETE /records/:id - Delete a record (Admin only) ----
router.delete("/:id", adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const record = await Record.findByIdAndDelete(id);

    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid record ID format" });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;