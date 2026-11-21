const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 60 },
  icon: { type: String, default: "Footprints" },
  completionHistory: [
    {
      date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
      completed: { type: Boolean, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Habit", habitSchema);
