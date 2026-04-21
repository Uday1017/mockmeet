const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const app = express();

// ── Security middleware ──
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // allows cookies to be sent from frontend
  }),
);

// ── Rate limiting on auth routes ──
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 requests per 15 min
  message: { message: "Too many requests, please try again later" },
});
app.use("/api/auth", authLimiter);

// ── Body parsing middleware ──
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Health check route ──
app.get("/", (req, res) => {
  res.json({ message: "MockMeet API is running" });
});

// ── 404 handler ──
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
