const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  date: {
    type: String, // stored as string for easy display or sorting
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  mood: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
  },
  entry: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('JournalEntry', journalEntrySchema);