import express from "express";
import { conversationController } from "./conversation.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", auth(), conversationController.createConversation);
router.get("/:id", auth(), conversationController.getConversation);

export const ConversationRoutes = router;
