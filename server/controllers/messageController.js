const Message = require("../models/Message");
const Match = require("../models/Match");

// ────────────────────────────────────────────────
// @route   GET /api/messages/:matchId
// @access  Private
// ────────────────────────────────────────────────
const getMessages = async (req, res) => {
  try {
    const { matchId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;

    // Make sure the user is part of this match
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    const isPartOfMatch =
      match.userA.toString() === req.user._id.toString() ||
      match.userB.toString() === req.user._id.toString();

    if (!isPartOfMatch) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Fetch messages — newest first, then reverse for display
    const messages = await Message.find({ matchId })
      .populate("sender", "name avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      messages: messages.reverse(),
      page,
    });
  } catch (error) {
    console.error("getMessages error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ────────────────────────────────────────────────
// @route   PATCH /api/messages/:matchId/read
// @access  Private
// ────────────────────────────────────────────────
const markAsRead = async (req, res) => {
  try {
    const { matchId } = req.params;

    // Mark all unread messages in this match as read
    // Only mark messages sent by the OTHER user
    await Message.updateMany(
      {
        matchId,
        sender: { $ne: req.user._id },
        isRead: false,
      },
      { $set: { isRead: true } },
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("markAsRead error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getMessages, markAsRead };
