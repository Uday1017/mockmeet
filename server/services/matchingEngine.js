const User = require("../models/User");
const Match = require("../models/Match");

// ── How much of B's wants does A's offers satisfy? ──
function skillOverlap(skillsOffered, skillsWanted) {
  if (!skillsWanted.length) return 0;
  const matched = skillsOffered.filter((s) =>
    skillsWanted.map((w) => w.toLowerCase()).includes(s.toLowerCase()),
  );
  return (matched.length / skillsWanted.length) * 100;
}

// ── Core scoring function ──
function calculateMatchScore(userA, userB) {
  // How much A can teach B
  const aTeachesB = skillOverlap(userA.skillsOffered, userB.skillsWanted);

  // How much B can teach A
  const bTeachesA = skillOverlap(userB.skillsOffered, userA.skillsWanted);

  // If both have skills, use geometric mean for mutual benefit
  // If one or both have no skills, use arithmetic mean
  let mutualScore;
  if (aTeachesB > 0 && bTeachesA > 0) {
    mutualScore = Math.sqrt(aTeachesB * bTeachesA);
  } else {
    mutualScore = (aTeachesB + bTeachesA) / 2;
  }

  // Bonus: same target role = more relevant interview practice
  const sharedRoles = userA.targetRoles.filter((r) =>
    userB.targetRoles.map((t) => t.toLowerCase()).includes(r.toLowerCase()),
  );
  const roleBonus = sharedRoles.length > 0 ? 15 : 0;

  // Bonus: same city = option for in-person sessions
  const cityBonus =
    userA.city &&
    userB.city &&
    userA.city.toLowerCase() === userB.city.toLowerCase()
      ? 5
      : 0;

  // Reputation factor — highly rated users rank higher
  const repFactor = ((userB.reputationScore || 5) / 5) * 10;

  // Base score for all users (so even 0% skill match shows some score)
  const baseScore = 5;

  const finalScore = Math.min(
    100,
    baseScore + mutualScore + roleBonus + cityBonus + repFactor,
  );

  return {
    score: Math.round(finalScore),
    aTeachesB: Math.round(aTeachesB),
    bTeachesA: Math.round(bTeachesA),
  };
}

// ── Get ranked matches for a user ──
async function getRankedMatches(userId, page = 1, limit = 20) {
  const user = await User.findById(userId);

  if (!user) {
    return {
      matches: [],
      message: "User not found",
    };
  }

  // Find existing match userIds to exclude them
  const existingMatches = await Match.find({
    $or: [{ userA: userId }, { userB: userId }],
  });
  const excludeIds = existingMatches.map((m) =>
    m.userA.toString() === userId.toString() ? m.userB : m.userA,
  );
  excludeIds.push(userId); // exclude self

  // Find ALL users except self and existing matches
  // No skill filtering - show everyone!
  const candidates = await User.find({
    _id: { $nin: excludeIds },
  });

  // Score and sort all candidates
  const scored = candidates
    .map((candidate) => {
      const { score, aTeachesB, bTeachesA } = calculateMatchScore(
        user,
        candidate,
      );
      return { user: candidate, score, aTeachesB, bTeachesA };
    })
    // Remove the filter - show ALL users even with 0% match
    .sort((a, b) => b.score - a.score); // Sort by score (highest first)

  // Paginate
  const total = scored.length;
  const paginated = scored.slice((page - 1) * limit, page * limit);

  return {
    matches: paginated,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
}

module.exports = { getRankedMatches, calculateMatchScore };
