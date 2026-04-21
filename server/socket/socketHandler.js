const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require("../models/Message");
const Match = require("../models/Match");

// ── Store online users: { userId: socketId } ──
const onlineUsers = new Map();

const initSocket = (io) => {
  // ── Auth middleware for socket connections ──
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(decoded.id).select("-passwordHash");
      if (!user) {
        return next(new Error("User not found"));
      }

      // Attach user to socket
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.name}`);

    // ── Add user to online users map ──
    onlineUsers.set(socket.user._id.toString(), socket.id);

    // ── Notify all connected users this person is online ──
    socket.broadcast.emit("user:online", {
      userId: socket.user._id,
      name: socket.user.name,
    });

    // ── Join a match room ──
    socket.on("join:match", (matchId) => {
      socket.join(matchId);
      console.log(`${socket.user.name} joined match room: ${matchId}`);
    });

    // ── Leave a match room ──
    socket.on("leave:match", (matchId) => {
      socket.leave(matchId);
    });

    // ── Send a message ──
    socket.on("send:message", async (data) => {
      try {
        const { matchId, content, type = "text" } = data;

        // Verify this user is part of the match
        const match = await Match.findById(matchId);
        if (!match) return;

        const isPartOfMatch =
          match.userA.toString() === socket.user._id.toString() ||
          match.userB.toString() === socket.user._id.toString();
        if (!isPartOfMatch) return;

        // Save message to database
        const message = await Message.create({
          matchId,
          sender: socket.user._id,
          content,
          type,
        });

        // Populate sender details
        await message.populate("sender", "name avatar");

        // Update lastMessageAt on the match
        await Match.findByIdAndUpdate(matchId, {
          lastMessageAt: new Date(),
        });

        // Emit message to everyone in the match room
        // (including the sender so they get the saved version)
        io.to(matchId).emit("receive:message", message);
      } catch (error) {
        console.error("send:message error:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // ── Typing indicators ──
    socket.on("typing:start", (matchId) => {
      socket.to(matchId).emit("typing:indicator", {
        userId: socket.user._id,
        name: socket.user.name,
        isTyping: true,
      });
    });

    socket.on("typing:stop", (matchId) => {
      socket.to(matchId).emit("typing:indicator", {
        userId: socket.user._id,
        name: socket.user.name,
        isTyping: false,
      });
    });

    // ── Handle disconnect ──
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.name}`);
      onlineUsers.delete(socket.user._id.toString());

      // Notify others this user went offline
      socket.broadcast.emit("user:offline", {
        userId: socket.user._id,
      });
    });
  });
};

// Helper to check if a user is online
const isUserOnline = (userId) => onlineUsers.has(userId.toString());

module.exports = { initSocket, isUserOnline };
