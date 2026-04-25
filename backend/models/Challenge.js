const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    points: { type: Number, required: true, min: 10, max: 500 },
    category: {
      type: String,
      enum: ['Strength', 'Cardio', 'Wellness', 'Yoga', 'Mindset', 'Steps'],
      default: 'Wellness'
    },
    goalType: {
      type: String,
      enum: ['daily', 'weekly', 'steps', 'calories', 'mindfulness', 'custom'],
      default: 'daily'
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy'
    },
    isActive: { type: Boolean, default: true },
    createdBy: { type: String, default: 'system' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Challenge', challengeSchema);
