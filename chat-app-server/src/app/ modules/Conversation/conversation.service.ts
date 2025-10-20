import httpStatus from "http-status";
import { TConversation } from "./conversation.interface";

import AppError from "../../errors/AppError";
import { Conversation } from "./conversation.model";
import mongoose from "mongoose";
import { io } from "../../../server";
import { Document } from "mongoose";

const createConversationIntoDB = async (data: TConversation) => {
  const { participants, isGroup, groupName } = data;
  let newConversation: Document & TConversation;
  if (!participants || participants.length < 2) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "At least 2 participants are required."
    );
  }

  if (!isGroup) {
    const existingConversation = await Conversation.findOne({
      isGroup: false,
      participants: { $all: participants, $size: 2 },
    }).populate("participants", "_id name avatar");
    if (existingConversation) {
      throw new AppError(httpStatus.CONFLICT, "Conversation already exists");
    }
    newConversation = await Conversation.create({
      participants,
    });
    newConversation = await newConversation.populate(
      "participants",
      "name email avatar"
    );

    participants.forEach((userId) => {
      io.to(userId.toString()).emit("new_conversation", newConversation);
    });

    return newConversation;
  }
  if (!groupName) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Group name is required for group chat."
    );
  }
  newConversation = await Conversation.create({
    ...data,
    isGroup: true,
  });
  participants.forEach((userId) => {
    io.to(userId.toString()).emit("new_conversation", newConversation);
  });

  return newConversation;
};

const getConversationFromDB = async (id: string) => {
  const objectId = new mongoose.Types.ObjectId(id);

  const result = await Conversation.aggregate([
    {
      $match: {
        participants: objectId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "participants",
        foreignField: "_id",
        as: "participants",
        pipeline: [
          {
            $project: {
              name: 1,
              email: 1,
              avatar: 1,
              isActive: 1,
              lastSeen: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "messages",
        localField: "lastMessage",
        foreignField: "_id",
        as: "lastMessage",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "sender",
              foreignField: "_id",
              as: "sender",
              pipeline: [{ $project: { name: 1, avatar: 1, email: 1 } }],
            },
          },
          { $unwind: { path: "$sender", preserveNullAndEmptyArrays: true } },
          {
            $project: {
              text: 1,
              createdAt: 1,
              sender: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: { path: "$lastMessage", preserveNullAndEmptyArrays: true },
    },
    {
      $sort: { updatedAt: -1 },
    },
  ]);

  return result;
};

export const conversationService = {
  createConversationIntoDB,
  getConversationFromDB,
};
