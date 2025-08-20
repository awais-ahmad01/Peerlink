
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
  duration: { type: Number }, 
  participants: [{
    username: String,
    socketId: String,
    joinedAt: Date,
    leftAt: Date
  }],
  maxParticipants: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'ended'], default: 'active' }
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;