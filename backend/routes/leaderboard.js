const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getStore } = require('../data/store');

const router = express.Router();

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const limit = Math.min(50, Number(req.query.limit) || 25);
    const leaderboard = await getStore().getLeaderboard(limit);
    res.json({ leaderboard });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
