import { TMessage } from "./message.interface";

import { Message } from "./message.model";
import { io } from "../../../server";

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const participants = (populatedMessage?.conversationId as any)?.participants;
  // if (Array.isArray(participants)) {
  //   participants.forEach((userId) => {
  //     io.to(userId.toString()).emit("new_message", populatedMessage);
  //   });
  // }

  return newMessage;
};

const getMessagesIntoDB = async (conversationId: string) => {
  if (!conversationId) {
    throw new Error("Conversation ID is required");
  }

  const messages = await Message.find({ conversationId }).populate(
    "sender",
    "name avatar"
  );
  return messages;
};

export const messageService = {
  createMessageIntoDB,
  getMessagesIntoDB,
};
