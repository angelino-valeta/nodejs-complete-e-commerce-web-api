const express = require('express');
const router = express.Router();
const { Product } = require('../models/product');


router.post('/', (req, res) => {
  const body = req.body;

  const product = new Product({
    name: body.name,
    image: body.image,
    countInStock: body.countInStock,
  });

  product
    .save()
    .then((data) => {
      return res.status(201).json({
        data,
        success: true,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
        success: false,
      });
    });
});

router.get('/', async (req, res) => {
  const products = await Product.find();

  if (!products) {
    return res.status(500).json({
      error: err,
      success: false,
    });
  }

  return res.status(200).json({
    data: products,
    success: true,
  });
});

module.exports = router;
