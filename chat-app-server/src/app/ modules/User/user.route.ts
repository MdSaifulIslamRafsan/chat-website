import express from "express";
import { userController } from "./user.controller";

const router = express.Router();

router.post("/", userController.createUser);
router.get("/:id/group", userController.getForGroupUser);
router.get("/:id", userController.getUser);

export const UserRoutes = router;
