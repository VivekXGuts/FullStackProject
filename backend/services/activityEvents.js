const EventEmitter = require('events');

class ActivityEvents extends EventEmitter {
  emitLeaderboardUpdate(payload) {
    this.emit('leaderboard:update', payload);
  }

  emitChallengeCompleted(payload) {
    this.emit('challenge:completed', payload);
  }

  emitChallengeCreated(payload) {
    this.emit('challenge:created', payload);
  }
}

module.exports = new ActivityEvents();
