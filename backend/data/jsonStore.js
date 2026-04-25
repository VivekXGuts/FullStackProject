const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const workouts = require('./workouts');
const { dailyChallenges } = require('./challenges');

const dataDir = path.join(__dirname, 'local');
const dbPath = path.join(dataDir, 'db.json');

const initialState = {
  users: [],
  workouts,
  challenges: dailyChallenges.map((challenge) => ({
    ...challenge,
    goalType: 'daily',
    difficulty: 'Easy',
    isActive: true,
    createdBy: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }))
};

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dbPath);
  } catch {
    await fs.writeFile(dbPath, JSON.stringify(initialState, null, 2));
  }
}

async function readStore() {
  await ensureStore();
  const raw = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(raw);
}

async function writeStore(data) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

function publicUser(user) {
  const safeUser = { ...user };
  delete safeUser.password;
  return safeUser;
}

async function getUsers() {
  const db = await readStore();
  return db.users;
}

async function getUsersPage({ page = 1, limit = 8, search = '' }) {
  const users = await getUsers();
  const normalizedSearch = search.toLowerCase().trim();
  const filtered = normalizedSearch
    ? users.filter(
        (user) =>
          user.username.toLowerCase().includes(normalizedSearch) ||
          user.email.toLowerCase().includes(normalizedSearch)
      )
    : users;

  const total = filtered.length;
  const start = (page - 1) * limit;

  return {
    items: filtered.slice(start, start + limit).map(publicUser),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit))
    }
  };
}

async function findUserByEmail(email) {
  const db = await readStore();
  return db.users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
}

async function findUserById(id) {
  const db = await readStore();
  return db.users.find((user) => user.id === id) || null;
}

async function createUser(userInput) {
  const db = await readStore();
  const exists = db.users.some(
    (user) =>
      user.email.toLowerCase() === userInput.email.toLowerCase() ||
      user.username.toLowerCase() === userInput.username.toLowerCase()
  );

  if (exists) {
    const error = new Error('A user with that email or username already exists.');
    error.status = 409;
    throw error;
  }

  const now = new Date().toISOString();
  const user = {
    id: crypto.randomUUID(),
    username: userInput.username.trim(),
    email: userInput.email.toLowerCase().trim(),
    role: userInput.role || 'user',
    password: userInput.password,
    fitnessLevel: userInput.fitnessLevel || 'Beginner',
    points: 0,
    level: 1,
    badges: ['Beginner Badge'],
    streak: 0,
    longestStreak: 0,
    lastActivityDate: null,
    completedWorkouts: [],
    completedChallenges: [],
    dailyLogs: [],
    pointsHistory: [],
    activityHistory: [],
    dailyGoal: 2,
    createdAt: now,
    updatedAt: now
  };

  db.users.push(user);
  await writeStore(db);
  return user;
}

async function updateUser(id, updater) {
  const db = await readStore();
  const index = db.users.findIndex((user) => user.id === id);

  if (index === -1) {
    return null;
  }

  const current = db.users[index];
  const next = typeof updater === 'function' ? updater({ ...current }) : { ...current, ...updater };
  next.updatedAt = new Date().toISOString();
  const storedNext = { ...next };
  delete storedNext.rewards;
  db.users[index] = storedNext;
  await writeStore(db);
  return next;
}

async function getWorkouts() {
  const db = await readStore();
  if (!db.workouts || db.workouts.length === 0) {
    db.workouts = workouts;
    await writeStore(db);
  }
  return db.workouts;
}

async function findWorkoutById(id) {
  const allWorkouts = await getWorkouts();
  return allWorkouts.find((workout) => workout.id === id || workout._id === id) || null;
}

async function getChallenges({ page = 1, limit = 6 } = {}) {
  const db = await readStore();
  const total = db.challenges.length;
  const start = (page - 1) * limit;

  return {
    items: db.challenges.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit))
    }
  };
}

async function getAllChallenges() {
  const db = await readStore();
  return db.challenges;
}

async function createChallenge(challengeInput) {
  const db = await readStore();
  const now = new Date().toISOString();
  const challenge = {
    id: crypto.randomUUID(),
    title: challengeInput.title,
    description: challengeInput.description,
    points: challengeInput.points,
    category: challengeInput.category,
    goalType: challengeInput.goalType || 'daily',
    difficulty: challengeInput.difficulty || 'Easy',
    isActive: challengeInput.isActive !== false,
    createdBy: challengeInput.createdBy || 'admin',
    createdAt: now,
    updatedAt: now
  };

  db.challenges.unshift(challenge);
  await writeStore(db);
  return challenge;
}

async function updateChallenge(id, updates) {
  const db = await readStore();
  const index = db.challenges.findIndex((challenge) => challenge.id === id);

  if (index === -1) {
    return null;
  }

  db.challenges[index] = {
    ...db.challenges[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  await writeStore(db);
  return db.challenges[index];
}

async function getDailyChallenge(date = new Date()) {
  const db = await readStore();
  const activeChallenges = db.challenges.filter((challenge) => challenge.isActive !== false);
  if (!activeChallenges.length) return null;
  const midnight = new Date(date);
  midnight.setHours(0, 0, 0, 0);
  const daySeed = Math.floor(midnight.getTime() / 86400000);
  return activeChallenges[daySeed % activeChallenges.length];
}

async function getLeaderboard(limit = 25) {
  const users = await getUsers();
  return users
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, limit)
    .map((user, index) => ({
      rank: index + 1,
      id: user.id,
      username: user.username,
      points: user.points || 0,
      level: user.level || 1,
      streak: user.streak || 0,
      badges: user.badges || [],
      role: user.role || 'user'
    }));
}

module.exports = {
  publicUser,
  getUsers,
  getUsersPage,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  getWorkouts,
  findWorkoutById,
  getChallenges,
  getAllChallenges,
  createChallenge,
  updateChallenge,
  getDailyChallenge,
  getLeaderboard
};
