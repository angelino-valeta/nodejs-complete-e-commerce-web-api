const express = require("express");
const { Order } = require("../models/order");
const router = express.Router();
const mongoose = require("mongoose");

router.post("/", async(req, res) => {
	
})

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
});


router.get("/:id", async(req, res) => {
	const { id } = req.params;

	if(!mongoose.isValidObjectId(id)){
		return res.status(400).json({success: false, message: "The Id is Invalid"});
	}

	try{
		const order = await Order.findById(id);
		return res.status(200).json({success: true, data:  order})
	}catch(err){
		return res.status(500).json({success: false, error: err})
	}

})

module.exports = router;
