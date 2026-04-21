const Match = require("../models/Match");
const User = require("../models/User");
const {
  getRankedMatches,
  calculateMatchScore,
} = require("../services/matchingEngine");

// ────────────────────────────────────────────────
// @route   GET /api/matches
// @access  Private
// ────────────────────────────────────────────────
const getPotentialMatches = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await getRankedMatches(req.user._id, page, limit);

    res.status(200).json(result);
  } catch (error) {
    console.error("getPotentialMatches error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ────────────────────────────────────────────────
// @route   POST /api/matches
// @access  Private
// ────────────────────────────────────────────────
const sendMatchRequest = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const currentUserId = req.user._id;

    // Cannot match with yourself
    if (targetUserId === currentUserId.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot send match request to yourself" });
    }

    // Check target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if match already exists between these two users
    const existingMatch = await Match.findOne({
      $or: [
        { userA: currentUserId, userB: targetUserId },
        { userA: targetUserId, userB: currentUserId },
      ],
    });
    if (existingMatch) {
      return res.status(400).json({ message: "Match request already exists" });
    }

    // Calculate match score
    const currentUser = await User.findById(currentUserId);
    const { score, aTeachesB, bTeachesA } = calculateMatchScore(
      currentUser,
      targetUser,
    );

    // Create match
    const match = await Match.create({
      userA: currentUserId,
      userB: targetUserId,
      initiatedBy: currentUserId,
      matchScore: score,
      aTeachesBScore: aTeachesB,
      bTeachesAScore: bTeachesA,
      status: "pending",
    });

    res.status(201).json({
      message: "Match request sent",
      match,
    });
  } catch (error) {
    console.error("sendMatchRequest error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ────────────────────────────────────────────────
// @route   PATCH /api/matches/:id/accept
// @access  Private
// ────────────────────────────────────────────────
const acceptMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    // Only the receiver (not initiator) can accept
    if (match.initiatedBy.toString() === req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Cannot accept your own match request" });
    }

    // Make sure this user is part of the match
    const isPartOfMatch =
      match.userA.toString() === req.user._id.toString() ||
      match.userB.toString() === req.user._id.toString();
    if (!isPartOfMatch) {
      return res.status(403).json({ message: "Not authorized" });
    }

    match.status = "accepted";
    await match.save();

    res.status(200).json({
      message: "Match accepted",
      match,
    });
  } catch (error) {
    console.error("acceptMatch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ────────────────────────────────────────────────
// @route   PATCH /api/matches/:id/reject
// @access  Private
// ────────────────────────────────────────────────
const rejectMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    const isPartOfMatch =
      match.userA.toString() === req.user._id.toString() ||
      match.userB.toString() === req.user._id.toString();
    if (!isPartOfMatch) {
      return res.status(403).json({ message: "Not authorized" });
    }

    match.status = "rejected";
    await match.save();

    res.status(200).json({ message: "Match rejected" });
  } catch (error) {
    console.error("rejectMatch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ────────────────────────────────────────────────
// @route   GET /api/matches/accepted
// @access  Private
// ────────────────────────────────────────────────
const getAcceptedMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [{ userA: req.user._id }, { userB: req.user._id }],
      status: "accepted",
    })
      .populate(
        "userA",
        "name avatar bio skillsOffered skillsWanted reputationScore",
      )
      .populate(
        "userB",
        "name avatar bio skillsOffered skillsWanted reputationScore",
      )
      .sort({ lastMessageAt: -1 });

    res.status(200).json({ matches });
  } catch (error) {
    console.error("getAcceptedMatches error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getPotentialMatches,
  sendMatchRequest,
  acceptMatch,
  rejectMatch,
  getAcceptedMatches,
};
