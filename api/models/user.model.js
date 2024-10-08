const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  avatar: {
    type: String,
    default: 'https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png'
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;