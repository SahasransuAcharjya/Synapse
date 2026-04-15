import express from "express";
import {
  saveMoodEntry,
  getMoodEntries,
  getMoodByMonth,
} from "../controllers/moodController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   POST /api/mood
// @access  Private
router.post("/", protect, saveMoodEntry);

// @route   GET /api/mood/:userId
// @access  Private
router.get("/:userId", protect, getMoodEntries);

// @route   GET /api/mood/:userId/month?year=2024&month=6
// @access  Private
router.get("/:userId/month", protect, getMoodByMonth);

export default router;