const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'Beginner',
        'Intermediate',
        'Advanced',
        'Yoga',
        'Cardio',
        'Strength',
        'Chest',
        'Back',
        'Legs',
        'Shoulders',
        'Arms',
        'Core'
      ],
      required: true
    },
    duration: { type: Number, required: true },
    difficulty: { type: String, required: true },
    calories: { type: Number, required: true },
    targetMuscles: { type: [String], default: [] },
    exercises: { type: [String], default: [] },
    demoLinks: {
      type: [
        new mongoose.Schema(
          {
            label: { type: String, required: true },
            url: { type: String, required: true }
          },
          { _id: false }
        )
      ],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workout', workoutSchema);
