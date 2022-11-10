const express = require("express");
const router = express.Router();
const { Product } = require("../models/product");
const { Category } = require("../models/category");

router.post("/", async (req, res) => {

  const {
    name,
    description,
    image,
    images,
    price,
    category,
    countInStock,
    rating,
    isFeature,
    numReviews,
  } = req.body;

  try{

    const categoryValid = await Category.findById(category);
    if(!categoryValid){
      return res.status(400).json({success: false, message: "Cannot create product because category invalid"});
    }  
  

    const product = await Product.create({
      name,
      description,
      image,
      images,
      price,
      category,
      countInStock,
      rating,
      isFeature,
      numReviews,
    })

    if(!product){
      return res.status(400).json({success: false, message: "The Product cannot be created"})
    }

    return res.status(201).json({success: true, data: product})

  }catch(err){
    return res.status(500).json({ success: false, error: err })
  }
});

router.get("/", async (req, res) => {
  try{
    const products = await Product.find().select('name descripton image').populate('category');
    return res.status(200).json({success: true, data: products})
  }catch(err){
    return res.status(500).json({success: false, error: err})
  }
});


router.get('/:id', async(req, res) => {
  const { id } = req.params

  try{

    const product = await Product.findById(id).populate('category')

    if(!product){
      return res.status(400).json({ success: false, mensagem: `Cannot given Product with ID ${id}` })
    }

    return res.status(200).json({success: true, data: product});

  }catch(err){
    return res.status(500).json({success: false, error: err})
  }

})


router.put('/:id', async(req, res) => {
  const { id } = req.params

  const {
    name,
    description,
    image,
    images,
    price,
    category,
    countInStock,
    rating,
    isFeature,
    numReviews,
  } = req.body;
  try{

    const product = await Product.findByIdAndUpdate(id, {
      name,
      description,
      image,
      images,
      price,
      category,
      countInStock,
      rating,
      isFeature,
      numReviews,
    }, {new: true})

    if(!product){
      return res.status(404).json({success: false, message: "Product cannot be updated!, not found"})
    }

    return res.status(200).json({success: true, data: product})

  }catch(err){
    return res.status(400).json({success: false, error: err})
  }
})

module.exports = router;
