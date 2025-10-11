import express from "express";
import { UserRoutes } from "../ modules/User/user.route";
import { ConversationRoutes } from "../ modules/Conversation/conversation.route";

const router = express.Router();

const modulesRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/conversation",
    route: ConversationRoutes,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
