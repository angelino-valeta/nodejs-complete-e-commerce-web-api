const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  orderItems: [],
  shippingAddress: [{name: String}],
  city: String,
  zip: String,
  phone: Number,
  status: String,
  totalPrice: Number,
  user: String,
  dateOrdered: {
    type: Date,
    default: Date.now
  }
})

exports.Order = mongoose.model('Order', orderSchema);