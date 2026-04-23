require('dotenv').config();
const { connectDatabase, getStore } = require('./store');

(async () => {
  await connectDatabase();
  const workouts = await getStore().getWorkouts();
  console.log(`Seed ready: ${workouts.length} workouts available.`);
  process.exit(0);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
