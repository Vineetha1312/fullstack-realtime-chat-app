import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);

router.get("/:receiverId", protectRoute, getMessages);
router.post("/send/:receiverId", protectRoute, sendMessage);


export default router;