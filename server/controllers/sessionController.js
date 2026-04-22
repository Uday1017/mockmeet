const Session = require("../models/Session");
const Match = require("../models/Match");
const User = require("../models/User");
const { transferCredits } = require("../services/creditService");
const { recalculateReputation } = require("../services/reputationService");

// ────────────────────────────────────────────────
// @route   POST /api/sessions
// @access  Private
// ────────────────────────────────────────────────
const proposeSession = async (req, res) => {
  try {
    const { matchId, scheduledAt, duration, targetRole, difficulty, meetLink } =
      req.body;

    // Verify match exists and is accepted
    const match = await Match.findById(matchId);
    if (!match || match.status !== "accepted") {
      return res
        .status(400)
        .json({ message: "Match not found or not accepted" });
    }

    // Verify user is part of this match
    const isPartOfMatch =
      match.userA.toString() === req.user._id.toString() ||
      match.userB.toString() === req.user._id.toString();
    if (!isPartOfMatch) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // The person proposing is the interviewer
    const intervieweeId =
      match.userA.toString() === req.user._id.toString()
        ? match.userB
        : match.userA;

    // Check interviewee has credits
    const interviewee = await User.findById(intervieweeId);
    if (interviewee.credits < 1) {
      return res
        .status(400)
        .json({ message: "Interviewee does not have enough credits" });
    }

    const session = await Session.create({
      interviewer: req.user._id,
      interviewee: intervieweeId,
      matchId,
      scheduledAt,
      duration: duration || 60,
      targetRole: targetRole || "",
      difficulty: difficulty || "medium",
      meetLink: meetLink || "",
    });

    res.status(201).json({
      message: "Session proposed successfully",
      session,
    });
  } catch (error) {
    console.error("proposeSession error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ────────────────────────────────────────────────
// @route   PATCH /api/sessions/:id/confirm
// @access  Private
// ────────────────────────────────────────────────
const confirmSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const isInterviewer =
      session.interviewer.toString() === req.user._id.toString();
    const isInterviewee =
      session.interviewee.toString() === req.user._id.toString();

    if (!isInterviewer && !isInterviewee) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (isInterviewer) session.interviewerConfirmed = true;
    if (isInterviewee) session.intervieweeConfirmed = true;

    // If both confirmed — transfer credits
    if (session.interviewerConfirmed && session.intervieweeConfirmed) {
      await session.save();
      await transferCredits(session._id);
    } else {
      await session.save();
    }

    res.status(200).json({
      message: "Session confirmed",
      session,
    });
  } catch (error) {
    console.error("confirmSession error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ────────────────────────────────────────────────
// @route   PATCH /api/sessions/:id/cancel
// @access  Private
// ────────────────────────────────────────────────
const cancelSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const isPartOfSession =
      session.interviewer.toString() === req.user._id.toString() ||
      session.interviewee.toString() === req.user._id.toString();
    if (!isPartOfSession) {
      return res.status(403).json({ message: "Not authorized" });
    }

    session.status = "cancelled";
    await session.save();

    res.status(200).json({ message: "Session cancelled", session });
  } catch (error) {
    console.error("cancelSession error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ────────────────────────────────────────────────
// @route   GET /api/sessions/upcoming
// @access  Private
// ────────────────────────────────────────────────
const getUpcomingSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [{ interviewer: req.user._id }, { interviewee: req.user._id }],
      status: "scheduled",
      scheduledAt: { $gte: new Date() },
    })
      .populate("interviewer", "name avatar")
      .populate("interviewee", "name avatar")
      .sort({ scheduledAt: 1 });

    res.status(200).json({ sessions });
  } catch (error) {
    console.error("getUpcomingSessions error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ────────────────────────────────────────────────
// @route   GET /api/sessions/past
// @access  Private
// ────────────────────────────────────────────────
const getPastSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [{ interviewer: req.user._id }, { interviewee: req.user._id }],
      status: { $in: ["completed", "cancelled", "no-show"] },
    })
      .populate("interviewer", "name avatar")
      .populate("interviewee", "name avatar")
      .sort({ scheduledAt: -1 });

    res.status(200).json({ sessions });
  } catch (error) {
    console.error("getPastSessions error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  proposeSession,
  confirmSession,
  cancelSession,
  getUpcomingSessions,
  getPastSessions,
};
