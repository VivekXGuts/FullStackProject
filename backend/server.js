require('dotenv').config();

const { app, ensureDatabaseReady } = require('./app');
const PORT = process.env.PORT || 3000;
ensureDatabaseReady()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Fitness gamification platform running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to start server:', error);
    process.exit(1);
  });
