const User = require("../models/User");

// ────────────────────────────────────────────────
// @route   GET /api/users/me
// @access  Private
// ────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    // req.user is already attached by auth middleware
    // No need to query database again
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.error("getMe error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ────────────────────────────────────────────────
// @route   PUT /api/users/me
// @access  Private
// ────────────────────────────────────────────────
const updateMe = async (req, res) => {
  try {
    // Fields the user is allowed to update
    // They should NOT be able to update credits or reputationScore directly
    const allowedFields = [
      "name",
      "bio",
      "college",
      "city",
      "targetRoles",
      "skillsOffered",
      "skillsWanted",
      "avatar",
    ];

    // Build update object with only allowed fields
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Check if there is anything to update
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      {
        new: true, // return updated document
        runValidators: true, // run schema validators on update
      },
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("updateMe error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ────────────────────────────────────────────────
// @route   GET /api/users/:id
// @access  Private
// ────────────────────────────────────────────────
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      // Only return public fields — never return tokens or private data
      "name avatar bio college city targetRoles skillsOffered skillsWanted reputationScore totalSessionsGiven totalSessionsTaken",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("getUserById error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ────────────────────────────────────────────────
// @route   GET /api/users/me/stats
// @access  Private
// ────────────────────────────────────────────────
const getMyStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "credits reputationScore totalSessionsGiven totalSessionsTaken noShowCount",
    );

    res.status(200).json({
      stats: {
        credits: user.credits,
        reputationScore: user.reputationScore,
        totalSessionsGiven: user.totalSessionsGiven,
        totalSessionsTaken: user.totalSessionsTaken,
        noShowCount: user.noShowCount,
      },
    });
  } catch (error) {
    console.error("getMyStats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getMe, updateMe, getUserById, getMyStats };
