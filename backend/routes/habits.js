const express = require("express");
const router = express.Router();
const Habit = require("../models/Habits");

//GET habits
router.get("/", async (req, res) => {
  try {
    const habits = await Habit.find().sort({ createdAt: 1 });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a habit
router.post("/", async (req, res) => {
  try {
    const { name, icon } = req.body;
    const habit = new Habit({ name, icon });
    const saved = await habit.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update a habit (edit name/icon, or set completion for a given date)
router.put("/:id", async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ error: "Habit not found" });

    const { name, icon, completedToday, date } = req.body;

    if (name !== undefined) habit.name = name;
    if (icon !== undefined) habit.icon = icon;

    if (completedToday !== undefined) {
      if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res
          .status(400)
          .json({ error: "A valid date (YYYY-MM-DD) is required" });
      }
      const existing = habit.completionHistory.find((h) => h.date === date);
      if (existing) existing.completed = !!completedToday;
      else habit.completionHistory.push({ date, completed: !!completedToday });
    }

    const updated = await habit.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a habit
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Habit.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Habit not found" });
    res.json({ message: "Habit deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
