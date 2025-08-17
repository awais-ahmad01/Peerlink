const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     isVerified: {
//         type: Boolean,
//         default: false
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
// });


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: false, // can be missing in Google accounts
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false, // not required for Google accounts
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  googleId: {
    type: String, // unique ID from Google
    required: false,
  },
 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const User = mongoose.model('User', userSchema);

module.exports = User;