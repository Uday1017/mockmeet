const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // never returned in queries by default
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      maxlength: [200, 'Bio cannot exceed 200 characters'],
      default: '',
    },
    college: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    targetRoles: {
      type: [String], // e.g. ["SDE-1", "Backend Engineer"]
      default: [],
    },
    skillsOffered: {
      type: [String], // what you can teach
      default: [],
    },
    skillsWanted: {
      type: [String], // what you want to learn
      default: [],
    },
    credits: {
      type: Number,
      default: 3, // every new user starts with 3 free credits
    },
    reputationScore: {
      type: Number,
      default: 5.0,
      min: 1.0,
      max: 5.0,
    },
    totalSessionsGiven: {
      type: Number,
      default: 0,
    },
    totalSessionsTaken: {
      type: Number,
      default: 0,
    },
    noShowCount: {
      type: Number,
      default: 0,
    },
    isGoogleCalendarConnected: {
      type: Boolean,
      default: false,
    },
    googleCalendarTokens: {
      access_token: String,
      refresh_token: String,
      expiry_date: Number,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // auto adds createdAt and updatedAt
  }
);

// ── Hash password before saving ──
// This runs automatically every time a user is saved
userSchema.pre('save', async function () {
  // Only hash if password was changed or is new
  if (!this.isModified('passwordHash')) return;
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
});

// ── Method to compare passwords at login ──
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
