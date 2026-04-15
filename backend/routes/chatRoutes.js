import express from "express";
import { sendMessage } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   POST /api/chat
// @access  Private
router.post("/", protect, sendMessage);

export default router;