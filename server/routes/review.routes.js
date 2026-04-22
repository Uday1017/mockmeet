const express = require("express");
const router = express.Router();
const {
  submitReview,
  getUserReviews,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, submitReview);
router.get("/user/:id", protect, getUserReviews);

module.exports = router;
