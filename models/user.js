const mongoose = require('mongoose');

const userSchrma = mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String,
  street: String,
  apartment: String,
  city: String,
  zip: String,
  country: String,
  phone: Number,
  isAdmin: boolean,
  dateCreated: {
    type: Date,
    default: Date.now
  }
})

exports.User = mongoose.model('Model', userSchrma);