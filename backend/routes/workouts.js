const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getStore } = require('../data/store');
const { applyActivity } = require('../services/gamification');
const activityEvents = require('../services/activityEvents');

const router = express.Router();

function isDateKey(value, key) {
  if (!value) return false;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).startsWith(key);
  return date.toISOString().slice(0, 10) === key;
}

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const workouts = await getStore().getWorkouts();
    res.json({ workouts });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/start', authMiddleware, async (req, res, next) => {
  try {
    const workout = await getStore().findWorkoutById(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found.' });
    }
    res.json({
      message: `${workout.title} started.`,
      workout,
      startedAt: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/complete', authMiddleware, async (req, res, next) => {
  try {
    const store = getStore();
    const workout = await store.findWorkoutById(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found.' });
    }

    const userId = req.user.id || String(req.user._id);
    const completedAt = new Date();
    const completedWorkout = {
      workoutId: workout.id,
      title: workout.title,
      duration: workout.duration,
      calories: workout.calories,
      difficulty: workout.difficulty,
      completedAt: completedAt.toISOString()
    };

    const updated = await store.updateUser(userId, (user) => {
      const next = applyActivity(user, {
        type: 'workout',
        title: `Completed ${workout.title}`,
        basePoints: 50,
        metadata: {
          workoutId: workout.id,
          calories: workout.calories,
          duration: workout.duration
        },
        completedAt
      });
      next.completedWorkouts = [completedWorkout, ...(user.completedWorkouts || [])];
      if (next.completedWorkouts.length >= 3 && !next.badges.includes('Consistency Badge')) {
        next.badges.push('Consistency Badge');
      }
      return next;
    });

    res.json({
      message: 'Workout completed. Points added.',
      user: store.publicUser(updated),
      rewards: updated.rewards
    });

    const leaderboard = await store.getLeaderboard(10);
    activityEvents.emitLeaderboardUpdate({ leaderboard });
  } catch (error) {
    next(error);
  }
});

router.get('/challenges', authMiddleware, async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(12, Number(req.query.limit) || 6);
    const challenges = await getStore().getChallenges({ page, limit });
    res.json(challenges);
  } catch (error) {
    next(error);
  }
});

router.get('/challenges/daily', authMiddleware, async (req, res, next) => {
  try {
    const challenge = await getStore().getDailyChallenge();
    if (!challenge) {
      return res.status(404).json({ message: 'No challenge is currently available.' });
    }
    const today = new Date().toISOString().slice(0, 10);
    const completed = (req.user.completedChallenges || []).some(
      (item) => item.challengeId === challenge.id && isDateKey(item.completedAt, today)
    );
    res.json({ challenge, completed });
  } catch (error) {
    next(error);
  }
});

router.post('/challenges/:id/complete', authMiddleware, async (req, res, next) => {
  try {
    const challenge = await getStore().getDailyChallenge();
    if (!challenge || req.params.id !== challenge.id) {
      return res.status(404).json({ message: 'That challenge is not active today.' });
    }

    const today = new Date().toISOString().slice(0, 10);
    const alreadyCompleted = (req.user.completedChallenges || []).some(
      (item) => item.challengeId === challenge.id && isDateKey(item.completedAt, today)
    );

    if (alreadyCompleted) {
      return res.status(409).json({ message: 'Daily challenge already completed.' });
    }

    const store = getStore();
    const userId = req.user.id || String(req.user._id);
    const completedAt = new Date();
    const updated = await store.updateUser(userId, (user) => {
      const next = applyActivity(user, {
        type: 'challenge',
        title: `Completed challenge: ${challenge.title}`,
        basePoints: challenge.points,
        metadata: { challengeId: challenge.id, category: challenge.category },
        completedAt
      });
      next.completedChallenges = [
        {
          challengeId: challenge.id,
          title: challenge.title,
          points: challenge.points,
          completedAt: completedAt.toISOString()
        },
        ...(user.completedChallenges || [])
      ];
      return next;
    });

    res.json({
      message: 'Daily challenge completed.',
      user: store.publicUser(updated),
      rewards: updated.rewards
    });

    const leaderboard = await store.getLeaderboard(10);
    activityEvents.emitLeaderboardUpdate({ leaderboard });
    activityEvents.emitChallengeCompleted({
      username: updated.username,
      title: challenge.title,
      points: challenge.points
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
