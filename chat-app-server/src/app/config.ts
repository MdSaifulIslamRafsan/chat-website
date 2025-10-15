import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  db_url: process.env.MONGO_URL,
  NODE_ENV: process.env.NODE_ENV,
  access_token: process.env.JWT_ACCESS_SECRET,
  refresh_token: process.env.JWT_REFRESH_SECRET,
  access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
};
