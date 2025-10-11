import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { conversationService } from "./conversation.service";

const createConversation = catchAsync(async (req, res) => {
  const result = await conversationService.createConversationIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Student is created successfully",
    data: result,
  });
});

export const conversationController = {
  createConversation,
};
