const mongoose = require("mongoose");

const journalEntrySchema = new mongoose.Schema({
  date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
  title: { type: String, required: true, trim: true, maxlength: 80 },
  entry: { type: String, required: true, maxlength: 10000 },
  mood: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("JournalEntry", journalEntrySchema);
