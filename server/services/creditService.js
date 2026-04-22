const User = require("../models/User");
const Session = require("../models/Session");

async function transferCredits(sessionId) {
  const session = await Session.findById(sessionId).populate(
    "interviewer interviewee",
  );

  if (!session) throw new Error("Session not found");

  if (!session.interviewerConfirmed || !session.intervieweeConfirmed) {
    throw new Error("Both parties must confirm before credits transfer");
  }

  if (session.creditsTransferred) {
    throw new Error("Credits already transferred");
  }

  // Check interviewee has enough credits
  const interviewee = await User.findById(session.interviewee._id);
  if (interviewee.credits < 1) {
    throw new Error("Insufficient credits");
  }

  // Interviewee pays 1 credit
  await User.findByIdAndUpdate(session.interviewee._id, {
    $inc: { credits: -1, totalSessionsTaken: 1 },
  });

  // Interviewer earns 1 credit
  await User.findByIdAndUpdate(session.interviewer._id, {
    $inc: { credits: +1, totalSessionsGiven: 1 },
  });

  // Mark credits as transferred
  await Session.findByIdAndUpdate(sessionId, {
    creditsTransferred: true,
    status: "completed",
  });
}

module.exports = { transferCredits };
