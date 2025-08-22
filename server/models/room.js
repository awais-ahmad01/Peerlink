const mongoose = require('mongoose');


const userRoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  userId: { type: String, required: true }, 
  username: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
  duration: { type: Number },
  

  participants: [{
    username: String,
    userId: String, 
    socketId: String,
    joinedAt: Date,
    leftAt: Date
  }],
  
  maxParticipants: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'ended'], default: 'active' }
});

userRoomSchema.index({ roomId: 1, userId: 1 }, { unique: true });


userRoomSchema.index({ userId: 1, status: 1, endedAt: -1 });

const Room = mongoose.model('room', userRoomSchema);

module.exports = Room;