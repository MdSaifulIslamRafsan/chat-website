import catchAsync from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import config from "../config";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import { User } from "../ modules/User/user.model";
import { Conversation } from "../ modules/Conversation/conversation.model";

const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid authorization");
    }

    const decoded = jwt.verify(
      token,
      config.access_token as string
    ) as JwtPayload;

    const { id, iat } = decoded;
    const user = await User.findById(id);
    if (!user) {
      throw new AppError(httpStatus.FORBIDDEN, "User not found");
    }
    if (await User.isDeleted(id)) {
      throw new AppError(httpStatus.FORBIDDEN, "User not found");
    }
    if (
      user?.passwordChangeAt &&
      (await User.isJWTTokenIssuedBeforePassword(
        iat as number,
        user?.passwordChangeAt
      ))
    ) {
      throw new AppError(httpStatus.FORBIDDEN, "user token not valid");
    }

    const conversationId = req?.params?.conversationId;

    if (conversationId) {
      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: id,
      });
      if (!conversation) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "Access denied to this conversation"
        );
      }
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
