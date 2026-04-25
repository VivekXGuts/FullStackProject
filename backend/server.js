require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');
const { app, ensureDatabaseReady } = require('./app');
const activityEvents = require('./services/activityEvents');
const PORT = process.env.PORT || 3000;
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: true
  }
});

io.on('connection', (socket) => {
  socket.emit('system:hello', {
    message: 'Realtime fitness updates connected.'
  });
});

activityEvents.on('leaderboard:update', (payload) => io.emit('leaderboard:update', payload));
activityEvents.on('challenge:completed', (payload) => io.emit('challenge:completed', payload));
activityEvents.on('challenge:created', (payload) => io.emit('challenge:created', payload));

ensureDatabaseReady()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Fitness gamification platform running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to start server:', error);
    process.exit(1);
  });
