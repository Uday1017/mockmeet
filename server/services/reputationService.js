const User = require("../models/User");
const Review = require("../models/Review");

async function recalculateReputation(userId) {
  const reviews = await Review.find({ reviewee: userId });

  if (!reviews.length) return 5.0;

  const avg =
    reviews.reduce((sum, r) => {
      const sessionAvg =
        (r.ratings.technical +
          r.ratings.communication +
          r.ratings.problemSolving +
          r.ratings.overall) /
        4;
      return sum + sessionAvg;
    }, 0) / reviews.length;

  // No-show penalty
  const user = await User.findById(userId);
  const noShowPenalty = user.noShowCount * 0.5;

  const finalScore = Math.max(1.0, Math.min(5.0, avg - noShowPenalty));

  await User.findByIdAndUpdate(userId, {
    reputationScore: parseFloat(finalScore.toFixed(1)),
  });

  return finalScore;
}

module.exports = { recalculateReputation };
