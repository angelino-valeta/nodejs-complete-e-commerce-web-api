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

categorySchema.virtual('id').get(function(){
  return this._id.toHexString();
})

categorySchema.set('toJSON', {
  virtuals: true
})

exports.Category = mongoose.model('Category', categorySchema)