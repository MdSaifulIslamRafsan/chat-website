import express from "express";
import { conversationController } from "./conversation.controller";

const router = express.Router();

router.post("/", conversationController.createConversation);

export const ConversationRoutes = router;
