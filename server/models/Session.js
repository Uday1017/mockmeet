const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    interviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      default: 60, // minutes
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "no-show"],
      default: "scheduled",
    },
    targetRole: {
      type: String,
      default: "",
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    aiGeneratedQuestions: {
      type: [String],
      default: [],
    },
    meetLink: {
      type: String,
      default: "",
    },
    interviewerConfirmed: {
      type: Boolean,
      default: false,
    },
    intervieweeConfirmed: {
      type: Boolean,
      default: false,
    },
    creditsTransferred: {
      type: Boolean,
      default: false,
    },
    reminderSent24h: {
      type: Boolean,
      default: false,
    },
    reminderSent1h: {
      type: Boolean,
      default: false,
    },
    noShowCheckedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
