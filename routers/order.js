const express = require("express");
const { OrderItem } = require("../models/orderItem")
const { Order } = require("../models/order");
const router = express.Router();
const mongoose = require("mongoose");

router.post("/", async(req, res) => {

	const {
		orderItems,
		shippingAddress,
		city,
		zip,
		country,
		phone,
		status,
		totalPrice,
	} = req.body
	
	try{

	const orderItemsPromise = Promise.all(orderItems.map(async item => {
		let newOrderItem = await OrderItem.create({quantity: item.quantity, productId: item.productId})
		return newOrderItem._id;
	}))

	const orderItemsIds = await orderItemsPromise;

	const order = await Order.create({
		orderItems:  orderItemsIds,
		shippingAddress,
		city,
		zip,
		country,
		phone,
		status,
		totalPrice,
		userId: req.auth.userId
	})

	if(!order){
		return res.status(500).json({message: "The order cannot be created!"})
	}

	return res.status(201).json({
		message: "Order created",
	})
	}catch(err){
		return res.status(500).json({ success: false, error: err });
	}
	
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
