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

habitSchema.virtual('completedToday').get(function(){
  const today = new Date().toISOString().split('T')[0];
  const entry = this.completionHistory.find((h)=> h.date === today);
  return entry ? entry.completed : false;
});

habitSchema.set('toJSON',{virtuals:true})
habitSchema.set("toObject", { virtuals: true });
module.exports = mongoose.model('Habit', habitSchema);