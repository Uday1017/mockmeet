const dotenv = require("dotenv");
dotenv.config();

const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./config/db");
const { initSocket } = require("./socket/socketHandler");
const { startNoShowJob } = require("./jobs/noShowJob");

const PORT = process.env.PORT || 5001;

connectDB()
  .then(() => {
    const server = http.createServer(app);

    // ── Initialize Socket.io ──
    const io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
      },
    });

    // ── Start socket handler ──
    initSocket(io);

    // ── Start cron jobs ──
    startNoShowJob();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Socket.io ready`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });
