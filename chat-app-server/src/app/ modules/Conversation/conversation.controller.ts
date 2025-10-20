import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { conversationService } from "./conversation.service";

const createConversation = catchAsync(async (req, res) => {
  const result = await conversationService.createConversationIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Conversation is created successfully",
    data: result,
  });
});
const getConversation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await conversationService.getConversationFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Conversations get successfully",
    data: result,
  });
});

export const conversationController = {
  createConversation,
  getConversation,
};
