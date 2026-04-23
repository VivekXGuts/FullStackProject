const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const workouts = require('./workouts');

const dataDir = path.join(__dirname, 'local');
const dbPath = path.join(dataDir, 'db.json');

const initialState = {
  users: [],
  workouts
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
  const { password, ...safeUser } = user;
  return safeUser;
}

async function getUsers() {
  const db = await readStore();
  return db.users;
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

module.exports = {
  publicUser,
  getUsers,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  getWorkouts,
  findWorkoutById
};
