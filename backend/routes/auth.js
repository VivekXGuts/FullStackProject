const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const { getStore } = require('../data/store');
const { dashboardMetrics } = require('../services/gamification');

const router = express.Router();
const BLOCKED_EMAIL_DOMAINS = new Set([
  'example.com',
  'example.org',
  'example.net',
  'test.com',
  'fake.com',
  'mailinator.com',
  'guerrillamail.com',
  'tempmail.com',
  'yopmail.com',
  '10minutemail.com',
  'sharklasers.com'
]);

function createToken(user) {
  return jwt.sign(
    {
      id: user.id || String(user._id),
      email: user.email,
      role: user.role || 'user'
    },
    process.env.JWT_SECRET || 'change-this-secret-in-production',
    { expiresIn: '7d' }
  );
}

function isRealisticEmail(email) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;

  const normalized = email.toLowerCase().trim();
  const [, domain = ''] = normalized.split('@');

  if (!domain || BLOCKED_EMAIL_DOMAINS.has(domain)) return false;
  if (normalized.includes('..')) return false;
  if (normalized.startsWith('.') || normalized.endsWith('.')) return false;
  if (domain.startsWith('-') || domain.endsWith('-')) return false;
  if (!/^[a-z0-9.-]+$/.test(domain)) return false;

  return true;
}

function validateSignup(req, res, next) {
  const { username, email, password } = req.body;
  if (!username || username.trim().length < 3) {
    return res.status(400).json({ message: 'Username must be at least 3 characters.' });
  }
  if (!isRealisticEmail(email)) {
    return res.status(400).json({ message: 'Please enter a real email address. Temporary and fake emails are not allowed.' });
  }
  if (!password || password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  }
  next();
}

router.post('/signup', validateSignup, async (req, res, next) => {
  try {
    const { username, email, password, fitnessLevel } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const store = getStore();
    const role =
      req.body.adminCode && req.body.adminCode === process.env.ADMIN_CODE ? 'admin' : 'user';
    const user = await store.createUser({
      username,
      email,
      password: hashedPassword,
      fitnessLevel,
      role
    });

    res.status(201).json({
      token: createToken(user),
      user: store.publicUser(user)
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const store = getStore();
    const user = await store.findUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.json({
      token: createToken(user),
      user: store.publicUser(user)
    });
  } catch (error) {
    next(error);
  }
});

router.get('/me', authMiddleware, async (req, res, next) => {
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

router.patch('/profile', authMiddleware, async (req, res, next) => {
  try {
    const { fitnessLevel, dailyGoal, bodyGoal } = req.body;
    const updates = {};

    if (fitnessLevel && ['Beginner', 'Intermediate', 'Advanced'].includes(fitnessLevel)) {
      updates.fitnessLevel = fitnessLevel;
    }

    if (bodyGoal && ['Lean & Fit', 'Muscle Gain', 'Fat Loss', 'Endurance'].includes(bodyGoal)) {
      updates.bodyGoal = bodyGoal;
    }

    if (Number.isInteger(Number(dailyGoal)) && Number(dailyGoal) >= 1 && Number(dailyGoal) <= 6) {
      updates.dailyGoal = Number(dailyGoal);
    }

    const store = getStore();
    const userId = req.user.id || String(req.user._id);
    const user = await store.updateUser(userId, updates);

    res.json({ user: store.publicUser(user) });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
