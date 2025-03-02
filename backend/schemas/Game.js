const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  active: { type: Boolean, default: true },
  destinations: [{
    destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
    answered: { type: Boolean, default: false },
    correct: Boolean
  }],
  currentDestinationIndex: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  lastPlayed: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', GameSchema);