const express = require("express");
const router = express.Router();
const {
  submitReview,
  getUserReviews,
  getMyReviews,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, submitReview);
router.get("/user/:id", protect, getUserReviews);
// Get reviews received by logged in user
router.get("/mine", protect, getMyReviews);

module.exports = router;
