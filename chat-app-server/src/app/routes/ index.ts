import express from "express";
import { UserRoutes } from "../ modules/User/user.route";

const router = express.Router();

const modulesRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
