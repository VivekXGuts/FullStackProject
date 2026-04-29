const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    title: { type: String, required: true },
    points: { type: Number, default: 0 },
    metadata: { type: Object, default: {} },
    completedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const pointsHistorySchema = new mongoose.Schema(
  {
    points: { type: Number, required: true },
    reason: { type: String, required: true },
    date: { type: Date, default: Date.now }
  },
  { _id: false }
);

const completedWorkoutSchema = new mongoose.Schema(
  {
    workoutId: { type: String, required: true },
    title: { type: String, required: true },
    duration: { type: Number, required: true },
    calories: { type: Number, required: true },
    difficulty: { type: String, required: true },
    completedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const challengeSchema = new mongoose.Schema(
  {
    challengeId: { type: String, required: true },
    title: { type: String, required: true },
    points: { type: Number, required: true },
    completedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const dailyLogSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    steps: { type: Number, default: 0 },
    caloriesBurned: { type: Number, default: 0 },
    minutesActive: { type: Number, default: 0 },
    sleepHours: { type: Number, default: 0 },
    recoveryRate: { type: Number, default: 0 },
    mood: { type: String, default: 'Focused' }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 28
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user'
    },
    password: { type: String, required: true },
    fitnessLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    bodyGoal: {
      type: String,
      enum: ['Lean & Fit', 'Muscle Gain', 'Fat Loss', 'Endurance'],
      default: 'Lean & Fit'
    },
    points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: { type: [String], default: ['Beginner Badge'] },
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActivityDate: { type: String, default: null },
    completedWorkouts: { type: [completedWorkoutSchema], default: [] },
    completedChallenges: { type: [challengeSchema], default: [] },
    dailyLogs: { type: [dailyLogSchema], default: [] },
    pointsHistory: { type: [pointsHistorySchema], default: [] },
    activityHistory: { type: [activitySchema], default: [] },
    dailyGoal: { type: Number, default: 2 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
