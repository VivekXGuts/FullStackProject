const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');
const validate = require('../middleware/validate');
const { getStore } = require('../data/store');
const activityEvents = require('../services/activityEvents');

const router = express.Router();

router.use(authMiddleware, requireRole('admin'));

router.get('/overview', async (req, res, next) => {
  try {
    const store = getStore();
    const [users, challenges, leaderboard] = await Promise.all([
      store.getUsers(),
      store.getChallenges({ page: 1, limit: 100 }),
      store.getLeaderboard(5)
    ]);

    const totalPoints = users.reduce((sum, user) => sum + (user.points || 0), 0);
    const activeChallenges = challenges.items.filter((challenge) => challenge.isActive).length;

    res.json({
      metrics: {
        totalUsers: users.length,
        activeChallenges,
        totalPoints,
        averageStreak: users.length
          ? Math.round(users.reduce((sum, user) => sum + (user.streak || 0), 0) / users.length)
          : 0
      },
      leaderboard
    });
  } catch (error) {
    next(error);
  }
});

router.get('/users', async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(20, Number(req.query.limit) || 8);
    const search = String(req.query.search || '');
    const data = await getStore().getUsersPage({ page, limit, search });
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.patch('/users/:id/role', validate(['role']), async (req, res, next) => {
  try {
    const role = String(req.body.role || '').toLowerCase();

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Role must be admin or user.' });
    }

    const updated = await getStore().updateUser(req.params.id, { role });

    if (!updated) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ user: getStore().publicUser(updated) });
  } catch (error) {
    next(error);
  }
});

router.get('/challenges', async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(20, Number(req.query.limit) || 6);
    const data = await getStore().getChallenges({ page, limit });
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.post(
  '/challenges',
  validate(['title', 'description', 'points', 'category']),
  async (req, res, next) => {
    try {
      const challenge = await getStore().createChallenge({
        title: req.body.title,
        description: req.body.description,
        points: Number(req.body.points),
        category: req.body.category,
        goalType: req.body.goalType || 'daily',
        difficulty: req.body.difficulty || 'Easy',
        isActive: req.body.isActive !== false,
        createdBy: req.user.username
      });

      activityEvents.emitChallengeCreated({
        title: challenge.title,
        points: challenge.points,
        category: challenge.category
      });

      res.status(201).json({ challenge });
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/challenges/:id', async (req, res, next) => {
  try {
    const challenge = await getStore().updateChallenge(req.params.id, req.body);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found.' });
    }

    res.json({ challenge });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
