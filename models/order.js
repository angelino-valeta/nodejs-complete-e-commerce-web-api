const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  orderItems: [],
  shippingAddress: [],
  city: String,
  zip: String,
  phone: Number,
  status: String,
  totalPrice: Number,
  user: String,
  dateOrdered: Date
})

exports.Order = mongoose.model('Order', orderSchema);