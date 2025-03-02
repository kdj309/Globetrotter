const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    unique: true, 
    required: true,
    trim: true 
  },
  score: {
    correct: { type: Number, default: 0 },
    incorrect: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now },
  lastPlayed: Date,
  gameHistory: [{
    destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
    correct: Boolean,
    timestamp: { type: Date, default: Date.now }
  }]
});
module.exports = mongoose.model('User', UserSchema);