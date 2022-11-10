const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {

  try {
    const category = await Category.find();
    return res.status(200).json({ data: category, success: true });
  } catch (err) {
    return res.status(500).json({ error: err, success: false });
  }
});

router.post("/", async (req, res) => {
  const { name, color, icon, image } = req.body;

  try{
    const category = await Category.create({
      name,
      color,
      icon,
      image,
    });

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "The category cannot be created" });
    }
  
    return res.status(201).json({
      success: true,
      data: category,
    });

  }catch(err){
    return res.status(500).json({success: false, error: err})
  }

});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try{

    const category = await Category.findByIdAndDelete(id);

    if(!category){
      return res.status(404).json({success: false, message: 'Category not found!'})
    }

    return res.status(200).json({ success: true });

  }catch(err){
    return res.status(400).json({success: false, error: err})
  }
});

module.exports = router;
