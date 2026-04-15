import mongoose from "mongoose";

const moodEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    sleepQuality: {
      type: String,
      enum: {
        values: ["No Sleep", "Poor", "Average", "Good", "Excellent"],
        message: "{VALUE} is not a valid sleep quality option",
      },
      default: "Average",
    },
    meditation: {
      type: Boolean,
      default: false,
    },
    medication: {
      type: Boolean,
      default: false,
    },
    socialInteraction: {
      type: Number,
      min: [1, "Social interaction score must be at least 1"],
      max: [5, "Social interaction score cannot exceed 5"],
      default: 3,
    },
    moodScore: {
      type: Number,
      min: [1, "Mood score must be at least 1"],
      max: [5, "Mood score cannot exceed 5"],
      required: [true, "Mood score is required"],
    },
    weather: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Unique constraint — one mood entry per user per day
moodEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

const MoodEntry = mongoose.model("MoodEntry", moodEntrySchema);

export default MoodEntry;