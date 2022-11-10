const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: String,
  description: String,
  richDescription: String,
  image: String,
  images: [],
  brand: String,
  price: {
    type: Number,
    required: true
  },
  category: String,
  countInStock: {
    type: Number,
    required: true,
  },
  rating: Number,
  isFeature: Boolean,
  dateCreated: Date
});

exports.Product = mongoose.model("Product", productSchema);

 