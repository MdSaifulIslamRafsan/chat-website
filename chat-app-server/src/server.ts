import app from "./app";
import mongoose from "mongoose";
import config from "./app/config";
import { Server } from "socket.io";
import { createServer } from "http";
import { User } from "./app/ modules/User/user.model";
const port = config.port || 5000;

// Initialize Socket.io
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

// Socket.io connections
io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);
  // Step 1: Save userId in the socket instance
  socket.on("userId", async (id) => {
    socket.userId = id; // store userId for later use
    await User.findByIdAndUpdate(id, { isActive: true });
  });
  // Step 2: Handle disconnect and update using stored userId
  socket.on("disconnect", async () => {
    console.log("❌ A user disconnected:", socket.id);
    if (socket.userId) {
      await User.findByIdAndUpdate(socket.userId, { isActive: false });
    }
  });
});

// Connect MongoDB & start server
const connectDB = async () => {
  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect(config.db_url as string);
    console.log("Database connected successfully");

    // Start the Express server
    server.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    // Log the error and exit the process if the connection fails
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};
connectDB();
