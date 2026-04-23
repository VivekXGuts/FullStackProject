const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getStore } = require('../data/store');

const router = express.Router();

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const store = getStore();
    const users = await store.getUsers();
    const leaderboard = users
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .slice(0, 25)
      .map((user, index) => ({
        rank: index + 1,
        username: user.username,
        points: user.points || 0,
        level: user.level || 1,
        streak: user.streak || 0,
        badges: user.badges || []
      }));

    res.json({ leaderboard });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
