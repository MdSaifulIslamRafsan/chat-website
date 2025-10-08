import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import notFound from "./app/middleware/notFound";
import router from "./app/routes/ index";
import globalErrorHandler from "./app/middleware/globalErrorhandler";
const app: Application = express();
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

// global error handler
app.use(globalErrorHandler);
// not found error handler
app.use(notFound);

export default app;
