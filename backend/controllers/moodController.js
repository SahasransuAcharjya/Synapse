import MoodEntry from "../models/MoodEntry.js";

// @desc    Save or update a daily mood entry
// @route   POST /api/mood
export const saveMoodEntry = async (req, res) => {
  const {
    date,
    sleepQuality,
    meditation,
    medication,
    socialInteraction,
    moodScore,
    weather,
  } = req.body;

  try {
    const entryDate = new Date(date);
    entryDate.setHours(0, 0, 0, 0);

    const existingEntry = await MoodEntry.findOne({
      userId: req.user._id,
      date: entryDate,
    });

    if (existingEntry) {
      // Update existing entry for that day
      existingEntry.sleepQuality = sleepQuality ?? existingEntry.sleepQuality;
      existingEntry.meditation = meditation ?? existingEntry.meditation;
      existingEntry.medication = medication ?? existingEntry.medication;
      existingEntry.socialInteraction =
        socialInteraction ?? existingEntry.socialInteraction;
      existingEntry.moodScore = moodScore ?? existingEntry.moodScore;
      existingEntry.weather = weather ?? existingEntry.weather;

      const updated = await existingEntry.save();
      return res.json(updated);
    }

    const entry = await MoodEntry.create({
      userId: req.user._id,
      date: entryDate,
      sleepQuality,
      meditation,
      medication,
      socialInteraction,
      moodScore,
      weather,
    });

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all mood entries for a user
// @route   GET /api/mood/:userId
export const getMoodEntries = async (req, res) => {
  try {
    const entries = await MoodEntry.find({
      userId: req.params.userId,
    }).sort({ date: -1 });

    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get mood entries for a specific month
// @route   GET /api/mood/:userId/month?year=2024&month=6
export const getMoodByMonth = async (req, res) => {
  const { year, month } = req.query;

  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const entries = await MoodEntry.find({
      userId: req.params.userId,
      date: { $gte: startDate, $lte: endDate },
    });

    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};