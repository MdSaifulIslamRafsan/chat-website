import httpStatus from "http-status";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import AppError from "../../errors/AppError";
import mongoose from "mongoose";

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
// const getUserFromDB = async (id: string) => {
//   const existingUserIds = await Conversation.distinct("participants", {
//     isGroup: false,
//     participants: id,
//   });

//   const availableUsers = await User.find({
//     _id: { $nin: existingUserIds },
//   });

//   return availableUsers;
// };

const getUserFromDB = async (id: string) => {
  const objectId = new mongoose.Types.ObjectId(id);

  const result = await User.aggregate([
    {
      $match: { _id: { $ne: objectId } },
    },
    {
      $lookup: {
        from: "conversations",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$isGroup", false] },
                  { $in: [objectId, "$participants"] },
                  { $in: ["$$userId", "$participants"] },
                ],
              },
            },
          },
        ],
        as: "existingConversation",
      },
    },
    {
      $match: {
        existingConversation: { $size: 0 },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        avatar: 1,
      },
    },
  ]);

  return result;
};

export const userService = {
  createUserIntoDB,
  getForGroupUserFromDB,
  getUserFromDB,
};
