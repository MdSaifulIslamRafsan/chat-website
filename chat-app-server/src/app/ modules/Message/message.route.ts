import express from "express";
import auth from "../../middleware/auth";
import { messageController } from "./message.controller";
import validateRequest from "../../middleware/validateRequest";
import { messageValidation } from "./message.validation";

const router = express.Router();

router.post("/", auth(), validateRequest(messageValidation.createMessageSchema), messageController.createMessage);
router.get("/:conversationId", auth(), messageController.getMessagesByConversationId);

export const MessageRoutes = router;
