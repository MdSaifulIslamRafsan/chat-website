import app from "./app";
import mongoose from "mongoose";
import config from "./app/config";
import { Server } from "socket.io";
import { createServer } from "http";
import { User } from "./app/ modules/User/user.model";
const port = config.port || 5000;

// Initialize Socket.io
const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

const onlineUsers = new Map<string, Set<string>>();

// Socket.io connections
io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);
  
  socket.on("userId", async (id) => {
    socket.userId = id;
    await User.findByIdAndUpdate(id, { isActive: true });
    if (!onlineUsers.has(id)) onlineUsers.set(id, new Set());
    onlineUsers.get(id)?.add(socket.id);
    socket.join(id);
    io.emit("update_online_users", Array.from(onlineUsers.keys()));
  });
  socket.on("disconnect", async () => {
    console.log("❌ A user disconnected:", socket.id);
    const id = socket.userId;
    if (!id) return;

    const userSockets = onlineUsers.get(id);
    if (userSockets) {
      userSockets.delete(socket.id);
      if (userSockets.size === 0) {
        onlineUsers.delete(id);
        await User.findByIdAndUpdate(id, {
          isActive: false,
          lastSeen: new Date(),
        });
      }
    }

    io.emit("update_online_users", Array.from(onlineUsers.keys()));
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
