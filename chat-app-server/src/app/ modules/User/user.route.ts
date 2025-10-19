import express from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", userController.createUser);
router.get("/:id/group", auth(), userController.getForGroupUser);
router.get("/:id", auth(), userController.getUser);

export const UserRoutes = router;
