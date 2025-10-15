import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

declare module "socket.io" {
  interface Socket {
    userId?: string;
  }
}
