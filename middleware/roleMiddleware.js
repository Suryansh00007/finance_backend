// ====================================================
// middleware/roleMiddleware.js - Role-Based Access Control
// ====================================================
//
// HOW IT WORKS:
// The client must pass a header: x-role: admin / analyst / viewer
// This middleware checks if the user's role is allowed
// to perform the action.
//
// PERMISSION LEVELS:
//   admin   -> Can create, update, delete records
//   analyst -> Can only view records
//   viewer  -> Can only view dashboard summary
// ====================================================

// List of valid roles
const VALID_ROLES = ["admin", "analyst", "viewer"];

// ---- Middleware: Only Admin can perform this action ----
const adminOnly = (req, res, next) => {
  const role = req.headers["x-role"]; // Read role from request header

  if (!role) {
    return res.status(400).json({ error: "Missing x-role header" });
  }

  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}` });
  }

  if (role !== "admin") {
    return res.status(403).json({
      error: "Access Denied. Only admin can perform this action.",
    });
  }

  // Role is valid and is admin — allow the request to continue
  next();
};

// ---- Middleware: Admin and Analyst can view records ----
const analystOrAdmin = (req, res, next) => {
  const role = req.headers["x-role"];

  if (!role) {
    return res.status(400).json({ error: "Missing x-role header" });
  }

  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}` });
  }

  if (role !== "admin" && role !== "analyst") {
    return res.status(403).json({
      error: "Access Denied. Only admin or analyst can view records.",
    });
  }

  next();
};

// ---- Middleware: All roles (viewer, analyst, admin) can see dashboard ----
const anyRole = (req, res, next) => {
  const role = req.headers["x-role"];

  if (!role) {
    return res.status(400).json({ error: "Missing x-role header" });
  }

  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}` });
  }

  // All valid roles can access this route
  next();
};

module.exports = { adminOnly, analystOrAdmin, anyRole };