const User = require('../models/User');
const Workout = require('../models/Workout');
const Challenge = require('../models/Challenge');
const seedWorkouts = require('./workouts');
const { dailyChallenges } = require('./challenges');

function normalizeMongoId(document) {
  const object = document.toObject ? document.toObject() : document;
  object.id = String(object._id);
  delete object._id;
  delete object.__v;
  return object;
}

function publicUser(user) {
  const safeUser = normalizeMongoId(user);
  delete safeUser.password;
  return safeUser;
}

async function ensureWorkouts() {
  const count = await Workout.countDocuments();
  if (count === 0) {
    await Workout.insertMany(
      seedWorkouts.map(({ id, ...workout }) => ({
        _id: id,
        ...workout
      }))
    );
  }
}

async function ensureChallenges() {
  const count = await Challenge.countDocuments();
  if (count === 0) {
    await Challenge.insertMany(
      dailyChallenges.map((challenge) => ({
        title: challenge.title,
        description: challenge.description,
        points: challenge.points,
        category: challenge.category,
        goalType: 'daily',
        difficulty: 'Easy',
        isActive: true,
        createdBy: 'system'
      }))
    );
  }
}

async function getUsers() {
  const users = await User.find().lean();
  return users.map((user) => ({ ...user, id: String(user._id) }));
}

async function getUsersPage({ page = 1, limit = 8, search = '' }) {
  const query = search
    ? {
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }
    : {};

  const total = await User.countDocuments(query);
  const items = await User.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    items: items.map(publicUser),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit))
    }
  };
}

async function findUserByEmail(email) {
  return User.findOne({ email: email.toLowerCase().trim() });
}

async function findUserById(id) {
  return User.findById(id);
}

async function createUser(userInput) {
  try {
    return await User.create(userInput);
  } catch (error) {
    if (error.code === 11000) {
      const duplicate = new Error('A user with that email or username already exists.');
      duplicate.status = 409;
      throw duplicate;
    }
    throw error;
  }
}

async function updateUser(id, updater) {
  const current = await User.findById(id);
  if (!current) return null;

  const next = typeof updater === 'function' ? updater(normalizeMongoId(current)) : updater;
  Object.assign(current, next);
  await current.save();
  return current;
}

async function getWorkouts() {
  await ensureWorkouts();
  const workouts = await Workout.find().lean();
  return workouts.map((workout) => ({ ...workout, id: String(workout._id) }));
}

async function findWorkoutById(id) {
  await ensureWorkouts();
  const workout = await Workout.findById(id).lean();
  return workout ? { ...workout, id: String(workout._id) } : null;
}

async function getChallenges({ page = 1, limit = 6 } = {}) {
  await ensureChallenges();
  const total = await Challenge.countDocuments();
  const items = await Challenge.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return {
    items: items.map((challenge) => ({ ...challenge, id: String(challenge._id), _id: undefined })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit))
    }
  };
}

async function getAllChallenges() {
  await ensureChallenges();
  const items = await Challenge.find().sort({ createdAt: -1 }).lean();
  return items.map((challenge) => ({ ...challenge, id: String(challenge._id), _id: undefined }));
}

async function createChallenge(challengeInput) {
  const created = await Challenge.create(challengeInput);
  return { ...created.toObject(), id: String(created._id), _id: undefined, __v: undefined };
}

async function updateChallenge(id, updates) {
  const updated = await Challenge.findByIdAndUpdate(id, updates, { new: true }).lean();
  return updated ? { ...updated, id: String(updated._id), _id: undefined } : null;
}

async function getDailyChallenge(date = new Date()) {
  await ensureChallenges();
  const activeChallenges = await Challenge.find({ isActive: true }).sort({ createdAt: 1 }).lean();
  if (!activeChallenges.length) return null;
  const midnight = new Date(date);
  midnight.setHours(0, 0, 0, 0);
  const daySeed = Math.floor(midnight.getTime() / 86400000);
  const challenge = activeChallenges[daySeed % activeChallenges.length];
  return { ...challenge, id: String(challenge._id), _id: undefined };
}

async function getLeaderboard(limit = 25) {
  const users = await User.find()
    .sort({ points: -1 })
    .limit(limit)
    .lean();

  return users.map((user, index) => ({
    rank: index + 1,
    id: String(user._id),
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
  ensureWorkouts,
  ensureChallenges,
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
