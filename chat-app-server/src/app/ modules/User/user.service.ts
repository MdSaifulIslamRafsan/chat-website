import httpStatus from "http-status";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import AppError from "../../errors/AppError";
import { Conversation } from "../Conversation/conversation.model";

const createUserIntoDB = async (data: TUser) => {
  const isExistUser = await User.findOne({ email: data?.email });

  if (isExistUser) {
    throw new AppError(httpStatus.CONFLICT, "User already exists");
  }

  const result = await User.create(data);
  return result;
};

const getForGroupUserFromDB = async (id: string) => {
  const result = await User.find({ _id: { $ne: id } });
  return result;
};
const getUserFromDB = async (id: string) => {
  const existingUserIds = await Conversation.distinct("participants", {
    isGroup: false,
    participants: id,
  });

  const availableUsers = await User.find({
    _id: { $nin: existingUserIds },
  });

  return availableUsers;
};
export const userService = {
  createUserIntoDB,
  getForGroupUserFromDB,
  getUserFromDB,
};
