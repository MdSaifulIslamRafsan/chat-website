import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import notFound from "./app/middleware/notFound";
import router from "./app/routes/ index";
import globalErrorHandler from "./app/middleware/globalErrorhandler";
import { Server } from "socket.io";
import { createServer } from "http";

const app: Application = express();
const server = createServer(app);
const io = new Server(server);
// Middleware
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(express.json());
app.use(cookieParser());

// global route handler
app.use("/api/v1", router);

// Route to handle GET requests at /api/users
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the chat app API");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// global error handler
app.use(globalErrorHandler);
// not found error handler
app.use(notFound);

export default app;
