var mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  surname: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: { 
    type: String, 
    trim: true, 
    required: true
  }, 
  RegisterDate: {
    type: Date,
    default: Date.now()
  }
});

var User = mongoose.model('User', userSchema);

module.exports = User