import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import httpStatus from "http-status";
import { messageService } from "./message.service";


const createMessage = catchAsync(async (req, res) => {
  const result = await messageService.createMessageIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Conversation is created successfully",
    data: result,
  });
});

const getMessagesByConversationId = catchAsync(async (req, res) => {
  const { conversationId } = req.params;

  const messages = await messageService.getMessagesIntoDB(
    conversationId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Messages retrieved successfully",
    data: messages,
  });
});

export const messageController = {
  createMessage,
  getMessagesByConversationId
};