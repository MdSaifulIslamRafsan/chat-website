import httpStatus from "http-status";
import { TConversation } from "./conversation.interface";

import AppError from "../../errors/AppError";
import { Conversation } from "./conversation.model";

const createConversationIntoDB = async (data: TConversation) => {
  const { participants, isGroup, groupName } = data;

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
    }).populate("participants", "name email profilePic");
    if (existingConversation) {
      throw new AppError(httpStatus.CONFLICT, "Conversation already exists");
    }
    const newConversation = await Conversation.create({
      participants,
    });
    return newConversation;
  }
  if (!groupName) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Group name is required for group chat."
    );
  }
  const newGroupConversation = await Conversation.create({
    ...data,
    isGroup: true,
  });
  return newGroupConversation;
};

export const conversationService = {
  createConversationIntoDB,
};
