// ============================
// routes/dashboardRoutes.js - Dashboard Summary Route
// ============================

const express = require("express");
const router = express.Router();
const Record = require("../models/Record");
const { anyRole } = require("../middleware/roleMiddleware");

// ---- GET /dashboard/summary - Get financial summary (All roles) ----
router.get("/summary", anyRole, async (req, res) => {
  try {
    // Fetch all records from the database
    const records = await Record.find();

    // Calculate total income: sum all records with type = "income"
    const totalIncome = records
      .filter((r) => r.type === "income")
      .reduce((sum, r) => sum + r.amount, 0);

    // Calculate total expense: sum all records with type = "expense"
    const totalExpense = records
      .filter((r) => r.type === "expense")
      .reduce((sum, r) => sum + r.amount, 0);

    // Net balance = income - expense
    const netBalance = totalIncome - totalExpense;

    res.json({
      summary: {
        totalIncome,
        totalExpense,
        netBalance,
        totalRecords: records.length,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;