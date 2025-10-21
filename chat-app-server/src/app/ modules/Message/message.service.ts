import { TMessage } from "./message.interface";

import { Message } from "./message.model";
import { io } from "../../../server";

const createMessageIntoDB = async (messageData: TMessage) => {
  const newMessage = await Message.create(messageData);
  io.to(newMessage.conversationId.toString()).emit("new_message", newMessage);

  return newMessage;
};

const getMessagesIntoDB = async (conversationId: string) => {
  if (!conversationId) {
    throw new Error("Conversation ID is required");
  }

  const messages = await Message.find({ conversationId }).populate(
    "sender",
    "name email avatar"
  );
  return messages;
};

export const messageService = {
  createMessageIntoDB,
  getMessagesIntoDB,
};
