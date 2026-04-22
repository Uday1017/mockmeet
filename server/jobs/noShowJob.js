const cron = require("node-cron");
const Session = require("../models/Session");
const User = require("../models/User");
const { recalculateReputation } = require("../services/reputationService");

const startNoShowJob = () => {
  // Run every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    try {
      const cutoff = new Date(Date.now() - 15 * 60 * 1000); // 15 min ago

      const overdueSessions = await Session.find({
        status: "scheduled",
        scheduledAt: { $lt: cutoff },
        noShowCheckedAt: { $exists: false },
      });

      for (const session of overdueSessions) {
        session.status = "no-show";
        session.noShowCheckedAt = new Date();
        await session.save();

        // Penalise both users
        await User.findByIdAndUpdate(session.interviewer, {
          $inc: { noShowCount: 1 },
        });
        await User.findByIdAndUpdate(session.interviewee, {
          $inc: { noShowCount: 1, credits: +1 }, // refund interviewee
        });

        // Recalculate reputation
        await recalculateReputation(session.interviewer);
        await recalculateReputation(session.interviewee);

        console.log(`No-show detected for session: ${session._id}`);
      }
    } catch (error) {
      console.error("No-show job error:", error);
    }
  });

  console.log("No-show detection job started");
};

module.exports = { startNoShowJob };
