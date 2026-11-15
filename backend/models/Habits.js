const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  icon: {
  type: String,
  default: 'Footprints',
  },
  completedToday: {
    type: Boolean,
    default: false,
  },
  completionHistory: [
    {
      date: { type: String, required: true }, // "2026-08-23"
      completed: { type: Boolean, required: true },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Habit', habitSchema);