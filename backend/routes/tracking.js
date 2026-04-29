const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { getStore } = require('../data/store');
const { applyActivity, dashboardMetrics } = require('../services/gamification');
const activityEvents = require('../services/activityEvents');

const router = express.Router();

router.post('/daily-log', authMiddleware, validate(['steps', 'caloriesBurned']), async (req, res, next) => {
  try {
    const steps = Number(req.body.steps);
    const caloriesBurned = Number(req.body.caloriesBurned);
    const mood = String(req.body.mood || 'Focused');
    const minutes = Number(req.body.minutesActive || 0);
    const sleepHours = Number(req.body.sleepHours || 0);
    const recoveryRate = Number(req.body.recoveryRate || 0);

    if (Number.isNaN(steps) || Number.isNaN(caloriesBurned) || steps < 0 || caloriesBurned < 0) {
      return res.status(400).json({ message: 'Steps and calories burned must be valid numbers.' });
    }

    if (
      Number.isNaN(sleepHours) ||
      Number.isNaN(recoveryRate) ||
      sleepHours < 0 ||
      sleepHours > 24 ||
      recoveryRate < 0 ||
      recoveryRate > 100
    ) {
      return res.status(400).json({ message: 'Sleep hours and recovery rate must be valid values.' });
    }

    const basePoints = Math.min(
      180,
      Math.floor(steps / 100) +
        Math.floor(caloriesBurned / 20) +
        Math.floor(sleepHours * 4) +
        Math.floor(recoveryRate / 20)
    );
    const completedAt = new Date();
    const userId = req.user.id || String(req.user._id);
    const store = getStore();

    const updated = await store.updateUser(userId, (user) => {
      const next = applyActivity(user, {
        type: 'daily-log',
        title: `Logged ${steps} steps, ${caloriesBurned} calories, and ${sleepHours}h sleep`,
        basePoints,
        metadata: { steps, caloriesBurned, mood, minutes, sleepHours, recoveryRate },
        completedAt
      });

      next.dailyLogs = [
        {
          date: completedAt.toISOString(),
          steps,
          caloriesBurned,
          minutesActive: minutes,
          sleepHours,
          recoveryRate,
          mood
        },
        ...(user.dailyLogs || [])
      ].slice(0, 30);

      return next;
    });

    const leaderboard = await store.getLeaderboard(10);
    activityEvents.emitLeaderboardUpdate({ leaderboard });

    res.status(201).json({
      user: store.publicUser(updated),
      rewards: updated.rewards
    });
  } catch (error) {
    next(error);
  }
});

router.get('/summary', authMiddleware, async (req, res, next) => {
  try {
    const store = getStore();
    const users = await store.getUsers();
    const sorted = users.sort((a, b) => (b.points || 0) - (a.points || 0));
    const id = req.user.id || String(req.user._id);
    const rank = sorted.findIndex((user) => (user.id || String(user._id)) === id) + 1;

    res.json({
      user: store.publicUser(req.user),
      metrics: dashboardMetrics(store.publicUser(req.user), rank || sorted.length)
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
