import express from "express";
import { conversationController } from "./conversation.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", auth(), conversationController.createConversation);

export const ConversationRoutes = router;
