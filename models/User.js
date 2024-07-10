const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  selectedVehicles: {
    type: [String],
    default: []
  },
  firstName: {
    type: String,
    required: false // Not required initially for existing users
  },
  lastName: {
    type: String,
    required: false // Not required initially for existing users
  },
  dob: {
    type: String,
    required: false // Not required initially for existing users
  }
});

module.exports = mongoose.model('User', UserSchema);
