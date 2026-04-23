const User = require('../models/User');
const Workout = require('../models/Workout');
const seedWorkouts = require('./workouts');

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

async function getUsers() {
  const users = await User.find().lean();
  return users.map((user) => ({ ...user, id: String(user._id) }));
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

module.exports = {
  publicUser,
  ensureWorkouts,
  getUsers,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  getWorkouts,
  findWorkoutById
};
