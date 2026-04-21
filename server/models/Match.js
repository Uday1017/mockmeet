const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    userA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    matchScore: {
      type: Number,
      default: 0,
    },
    aTeachesBScore: {
      type: Number,
      default: 0,
    },
    bTeachesAScore: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "blocked"],
      default: "pending",
    },
    initiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastMessageAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// ── Prevent duplicate match requests between same two users ──
matchSchema.index({ userA: 1, userB: 1 }, { unique: true });

const Match = mongoose.model("Match", matchSchema);

module.exports = Match;
