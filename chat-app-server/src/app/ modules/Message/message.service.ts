import { TMessage } from "./message.interface";
import httpStatus from "http-status";

import { Message } from "./message.model";
import { io } from "../../../server";
import { Conversation } from "../Conversation/conversation.model";
import AppError from "../../errors/AppError";

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
  if (!conversationId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Conversation ID is required");
  }
  const skip = (page - 1) * limit;

  const messages = await Message.find({ conversationId })
    .populate("sender", "name avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  return messages.reverse();
};

export const messageService = {
  createMessageIntoDB,
  getMessagesIntoDB,
};
