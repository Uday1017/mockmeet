const express = require("express");
const router = express.Router();
const { getMessages, markAsRead } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:matchId", protect, getMessages);
router.patch("/:matchId/read", protect, markAsRead);

module.exports = router;
