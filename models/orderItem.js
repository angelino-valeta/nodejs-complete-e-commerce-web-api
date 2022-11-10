const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
  product: String,
  quantity: Number,
})

exports.OrderItem = mongoose.model('OrderItem', orderItemSchema);