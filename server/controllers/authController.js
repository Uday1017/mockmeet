const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ── Helper: generate access token (short lived) ──
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

// ── Helper: generate refresh token (long lived) ──
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

// ── Helper: send refresh token as httpOnly cookie ──
const sendRefreshToken = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true, // JS cannot access this cookie — prevents XSS
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

// ────────────────────────────────────────────────
// @route   POST /api/auth/register
// @access  Public
// ────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 3. Create new user
    // Note: passwordHash field will be auto-hashed by the pre('save') hook
    const user = await User.create({
      name,
      email,
      passwordHash: password,
    });

    // 4. Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // 5. Send refresh token in cookie, access token in response
    sendRefreshToken(res, refreshToken);

    res.status(201).json({
      message: "Registration successful",
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits,
        reputationScore: user.reputationScore,
        skillsOffered: user.skillsOffered,
        skillsWanted: user.skillsWanted,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ────────────────────────────────────────────────
// @route   POST /api/auth/login
// @access  Public
// ────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check fields
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // 2. Find user — explicitly select passwordHash (select:false by default)
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 4. Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // 5. Update last active
    user.lastActive = Date.now();
    await user.save({ validateBeforeSave: false });

    // 6. Send tokens
    sendRefreshToken(res, refreshToken);

    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits,
        reputationScore: user.reputationScore,
        skillsOffered: user.skillsOffered,
        skillsWanted: user.skillsWanted,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ────────────────────────────────────────────────
// @route   POST /api/auth/refresh
// @access  Public (uses refresh token cookie)
// ────────────────────────────────────────────────
const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    // Verify refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Check user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    // Issue new access token
    const accessToken = generateAccessToken(user._id);

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

// ────────────────────────────────────────────────
// @route   POST /api/auth/logout
// @access  Private
// ────────────────────────────────────────────────
const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { register, login, refresh, logout };
