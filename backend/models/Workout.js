const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Yoga', 'Cardio', 'Strength'],
      required: true
    },
    duration: { type: Number, required: true },
    difficulty: { type: String, required: true },
    calories: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workout', workoutSchema);
