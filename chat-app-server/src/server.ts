import app from "./app";
import mongoose from "mongoose";
import config from "./app/config";
const connectDB = async () => {
  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect(config.db_url as string);
    console.log("Database connected successfully");

    // Start the Express server
    app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (error) {
    // Log the error and exit the process if the connection fails
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};
connectDB();
