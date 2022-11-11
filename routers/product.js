const express = require("express");
const router = express.Router();
const { Product } = require("../models/product");
const { Category } = require("../models/category");
const mongoose = require('mongoose');

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

  try {
    const categoryValid = await Category.findById(category);
    if (!categoryValid) {
      return res.status(400).json({
        success: false,
        message: "Cannot create product because category invalid",
      });
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
    });

    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "The Product cannot be created" });
    }

    return res.status(201).json({ success: true, data: product });
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
});

router.get("/", async (req, res) => {

  let filter = {}
  const query = req.query.categories
  if(query){
    filter = { category: query.split(',') }
  }

  try {
    const products = await Product.find(filter)
      .select("name descripton image")
      .populate("category");
    return res.status(200).json({ success: true, data: products });
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
});

router.get('/get/featured', async(req, res) => {
  try{
    const products = await Product.find({ isFeature: true });

    return res.status(200).json({
      success: true,
      data: products
    })

  }catch(err){
    return res.status(500).json({success: false, error: err})
  }
})

router.get("/get/count", async (req, res) => {
  try{

  const totalProduct = await Product.count()

  if (!totalProduct) {
    return res.status(500).json({ success: false });
  }

  return res.status(200).json({ success: true, data: {total: totalProduct} });
  }catch(err){
    return res.status(500).json({ success: false, error: err });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "The Id is Invalid" });
  }

  try {
    const product = await Product.findById(id).populate("category");

    if (!product) {
      return res.status(400).json({
        success: false,
        message: `Cannot given Product with ID ${id}`,
      });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "The Id is Invalid" });
  }

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
  try {
    const categoryValid = await Category.findById(category);
    if (!categoryValid) {
      return res.status(400).json({
        success: false,
        message: "Cannot create product because category invalid",
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      {
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
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product cannot be updated!, not found",
      });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (err) {
    return res.status(400).json({ success: false, error: err });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "The Id is Invalid" });
  }

  try {
    const product = await Product.findByIdAndRemove(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `The category with the given ID ${id}, was not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product Deleted",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err,
    });
  }
});

module.exports = router;
