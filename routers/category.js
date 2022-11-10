const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const category = await Category.find();

  try {
    return res.status(200).json({ data: category, success: true });
  } catch (err) {
    return res.status(500).json({ error: err, success: false });
  }
});

module.exports = router;
