const mongoose = require('mongoose');
const jsonStore = require('./jsonStore');

let activeStore = jsonStore;
let usingMongo = false;

async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    console.log('Using JSON datastore. Set MONGODB_URI to enable MongoDB.');
    return activeStore;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    activeStore = require('./mongoStore');
    usingMongo = true;
    await activeStore.ensureWorkouts();
    console.log('Connected to MongoDB.');
  } catch (error) {
    console.warn('MongoDB unavailable. Falling back to JSON datastore.');
    console.warn(error.message);
    activeStore = jsonStore;
  }

  return activeStore;
}

function getStore() {
  return activeStore;
}

function isMongoActive() {
  return usingMongo;
}

module.exports = {
  connectDatabase,
  getStore,
  isMongoActive
};
