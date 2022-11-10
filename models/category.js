const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  color: String,
  icon: String,
  image: String,
  dateCreated: {
    type: Date,
    default: Date.now
  }
})

exports.Category = mongoose.model('Category', categorySchema)