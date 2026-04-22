const Review = require("../models/Review");
const Session = require("../models/Session");
const { recalculateReputation } = require("../services/reputationService");

// ────────────────────────────────────────────────
// @route   POST /api/reviews
// @access  Private
// ────────────────────────────────────────────────
const submitReview = async (req, res) => {
  try {
    const { sessionId, ratings, strengths, improvements, wouldInterviewAgain } =
      req.body;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Only participants can review
    const isInterviewer =
      session.interviewer.toString() === req.user._id.toString();
    const isInterviewee =
      session.interviewee.toString() === req.user._id.toString();
    if (!isInterviewer && !isInterviewee) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Reviewee is the other person
    const revieweeId = isInterviewer
      ? session.interviewee
      : session.interviewer;

    const review = await Review.create({
      sessionId,
      reviewer: req.user._id,
      reviewee: revieweeId,
      ratings,
      strengths: strengths || [],
      improvements: improvements || [],
      wouldInterviewAgain: wouldInterviewAgain ?? true,
    });

    // Recalculate reputation for the reviewee
    await recalculateReputation(revieweeId);

    res.status(201).json({
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this session" });
    }
    console.error("submitReview error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ────────────────────────────────────────────────
// @route   GET /api/reviews/user/:id
// @access  Private
// ────────────────────────────────────────────────
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      reviewee: req.params.id,
      isPublic: true,
    })
      .populate("reviewer", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({ reviews });
  } catch (error) {
    console.error("getUserReviews error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ────────────────────────────────────────────────
// @route   GET /api/reviews/mine
// @access  Private
// ────────────────────────────────────────────────
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.user._id })
      .populate('reviewer', 'name avatar')
      .populate('sessionId', 'targetRole scheduledAt')
      .sort({ createdAt: -1 });

    res.status(200).json({ reviews });
  } catch (error) {
    console.error('getMyReviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { submitReview, getUserReviews, getMyReviews };
