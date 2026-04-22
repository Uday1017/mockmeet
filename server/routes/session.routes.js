const express = require("express");
const router = express.Router();
const {
  proposeSession,
  confirmSession,
  cancelSession,
  getUpcomingSessions,
  getPastSessions,
  getSessionQuestions,
} = require("../controllers/sessionController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, proposeSession);
router.patch("/:id/confirm", protect, confirmSession);
router.patch("/:id/cancel", protect, cancelSession);
router.get("/upcoming", protect, getUpcomingSessions);
router.get("/past", protect, getPastSessions);
router.get("/:id/questions", protect, getSessionQuestions);

module.exports = router;
