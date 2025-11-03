import { TMessage } from "./message.interface";
import httpStatus from "http-status";

import { Message } from "./message.model";
import { io } from "../../../server";
import { Conversation } from "../Conversation/conversation.model";
import AppError from "../../errors/AppError";
import mongoose from "mongoose";

const createMessageIntoDB = async (messageData: TMessage) => {
  const newMessage = await Message.create(messageData);
  const populatedMessage = await newMessage.populate([
    { path: "sender", select: "name avatar" },
    { path: "conversationId", select: "participants" },
  ]);
  io.to(messageData?.conversationId.toString()).emit(
    "new_message",
    populatedMessage
  );

  const conversationUpdate = await Conversation.findByIdAndUpdate(
    newMessage?.conversationId,
    { lastMessage: newMessage?.id }
  );
  if (!conversationUpdate) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Failed to update conversation lastMessage"
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const participants = (populatedMessage?.conversationId as any)?.participants;
  // if (Array.isArray(participants)) {
  //   participants.forEach((userId) => {
  //     io.to(userId.toString()).emit("new_message", populatedMessage);
  //   });
  // }

  return newMessage;
};

const getMessagesIntoDB = async (
  conversationId: string,
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;

  const start = Date.now();
  const messages = await Message.aggregate([
    {
      $match: {
        conversationId: new mongoose.Types.ObjectId(conversationId),
      },
    },
    { $sort: { createdAt: 1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $project: {
        text: 1,
        createdAt: 1,
        sender: 1,
        _id: 1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "sender",
        pipeline: [{ $project: { name: 1, avatar: 1, _id: 0 } }],
      },
    },
    { $unwind: "$sender" },
  ]);
  const end = Date.now();

  console.log("Query execution time:", end - start, "ms");
  return messages;
};

export const messageService = {
  createMessageIntoDB,
  getMessagesIntoDB,
};
