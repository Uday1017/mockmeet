const express = require("express");
const router = express.Router();
const {
  getMe,
  updateMe,
  getUserById,
  getMyStats,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// All routes here are protected — user must be logged in
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.get("/me/stats", protect, getMyStats);
router.get("/:id", protect, getUserById);

module.exports = router;
