const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  orderItems: [
     {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true
     }
  ],
  shippingAddress: [{address: {type: String, required: true}}],
  city: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: "Pending"
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  dateOrdered: {
    type: Date,
    default: Date.now
  }
})

orderSchema.virtual('id').get(function (){
  return this._id.toHexString();
})

orderSchema.set('toJSON', {
  virtuals: true
})

exports.Order = mongoose.model('Order', orderSchema);