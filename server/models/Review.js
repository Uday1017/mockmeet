const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ratings: {
      technical: { type: Number, required: true, min: 1, max: 5 },
      communication: { type: Number, required: true, min: 1, max: 5 },
      problemSolving: { type: Number, required: true, min: 1, max: 5 },
      overall: { type: Number, required: true, min: 1, max: 5 },
    },
    strengths: [String],
    improvements: [String],
    comments: {
      type: String,
      maxlength: 500,
      default: '',
    },
    wouldInterviewAgain: { type: Boolean, default: true },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Prevent duplicate reviews for same session by same reviewer
reviewSchema.index({ sessionId: 1, reviewer: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
