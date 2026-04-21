const express = require("express");
const router = express.Router();
const {
  getPotentialMatches,
  sendMatchRequest,
  acceptMatch,
  rejectMatch,
  getAcceptedMatches,
} = require("../controllers/matchController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getPotentialMatches);
router.post("/", protect, sendMatchRequest);
router.get("/accepted", protect, getAcceptedMatches);
router.patch("/:id/accept", protect, acceptMatch);
router.patch("/:id/reject", protect, rejectMatch);

module.exports = router;
