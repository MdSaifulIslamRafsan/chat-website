import jwt, { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
export const createJwtToken = (
  JwtPayload: { id: Types.ObjectId },
  secreteToken: string,
  expiresIn: number
) => {
  return jwt.sign(JwtPayload, secreteToken, {
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
