import Journal from "../models/Journal.js";

// @desc    Create a new journal entry
// @route   POST /api/journal
export const createEntry = async (req, res) => {
  const { title, content, imageUrl } = req.body;

  try {
    const entry = await Journal.create({
      userId: req.user._id,
      title,
      content,
      imageUrl: imageUrl || "",
    });

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all journal entries for a user
// @route   GET /api/journal/:userId
export const getEntries = async (req, res) => {
  try {
    const entries = await Journal.find({ userId: req.params.userId }).sort({
      date: -1,
    });

    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a journal entry
// @route   PUT /api/journal/:id
export const updateEntry = async (req, res) => {
  const { title, content, imageUrl } = req.body;

  try {
    const entry = await Journal.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    if (entry.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    entry.title = title || entry.title;
    entry.content = content || entry.content;
    entry.imageUrl = imageUrl || entry.imageUrl;

    const updatedEntry = await entry.save();
    res.json(updatedEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a journal entry
// @route   DELETE /api/journal/:id
export const deleteEntry = async (req, res) => {
  try {
    const entry = await Journal.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    if (entry.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await entry.deleteOne();
    res.json({ message: "Entry removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};