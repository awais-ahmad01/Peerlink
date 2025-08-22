const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: false, 
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false, 
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  googleId: {
    type: String, 
    required: false,
  },
 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const User = mongoose.model('User', userSchema);

module.exports = User;