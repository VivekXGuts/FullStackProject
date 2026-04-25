require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { connectDatabase, isMongoActive } = require('./data/store');

const authRoutes = require('./routes/auth');
const workoutRoutes = require('./routes/workouts');
const leaderboardRoutes = require('./routes/leaderboard');
const trackingRoutes = require('./routes/tracking');
const adminRoutes = require('./routes/admin');

const app = express();
const frontendPath = path.join(__dirname, '..', 'frontend');

function normalizeOrigin(value) {
  const trimmed = String(value || '').trim();

  if (!trimmed) return '';

  try {
    return new URL(trimmed).origin;
  } catch {
    return trimmed.replace(/\/+$/, '');
  }
}

function isAllowedByPattern(origin) {
  if (!origin) return true;

  try {
    const url = new URL(origin);
    const hostname = url.hostname.toLowerCase();

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return true;
    }

    if (hostname.endsWith('.github.io') || hostname.endsWith('.vercel.app')) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

const allowedOrigins = (process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

let databaseReadyPromise;

function ensureDatabaseReady() {
  if (!databaseReadyPromise) {
    databaseReadyPromise = connectDatabase();
  }

  return databaseReadyPromise;
}

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);
app.set('trust proxy', 1);
app.use(
  cors({
    origin(origin, callback) {
      const normalizedRequestOrigin = normalizeOrigin(origin);

      if (
        !normalizedRequestOrigin ||
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(normalizedRequestOrigin) ||
        isAllowedByPattern(normalizedRequestOrigin)
      ) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    }
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(
  '/api/',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 250,
    standardHeaders: true,
    legacyHeaders: false
  })
);

// Ensure the backing store is ready before protected routes execute.
app.use(async (req, res, next) => {
  try {
    await ensureDatabaseReady();
    next();
  } catch (error) {
    next(error);
  }
});

app.use(express.static(frontendPath));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    datastore: isMongoActive() ? 'mongodb' : 'json',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);

app.get('/profile', (req, res) => res.sendFile(path.join(frontendPath, 'profile.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(frontendPath, 'dashboard.html')));
app.get('/workouts', (req, res) => res.sendFile(path.join(frontendPath, 'workouts.html')));
app.get('/leaderboard', (req, res) => res.sendFile(path.join(frontendPath, 'leaderboard.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(frontendPath, 'admin.html')));

app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API route not found.' });
  }
  return res.status(404).sendFile(path.join(frontendPath, 'index.html'));
});

app.use((error, req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message || 'Something went wrong.'
  });
});

module.exports = {
  app,
  ensureDatabaseReady
};
