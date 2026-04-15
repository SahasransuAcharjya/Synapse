import express from "express";
import {
  createEntry,
  getEntries,
  updateEntry,
  deleteEntry,
} from "../controllers/journalController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   POST /api/journal
// @access  Private
router.post("/", protect, createEntry);

// @route   GET /api/journal/:userId
// @access  Private
router.get("/:userId", protect, getEntries);

// @route   PUT /api/journal/:id
// @access  Private
router.put("/:id", protect, updateEntry);

// @route   DELETE /api/journal/:id
// @access  Private
router.delete("/:id", protect, deleteEntry);

export default router;