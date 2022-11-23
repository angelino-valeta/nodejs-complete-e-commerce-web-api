const express = require("express");
const { OrderItem } = require("../models/orderItem");
const { Order } = require("../models/order");
const router = express.Router();
const mongoose = require("mongoose");

router.post("/", async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    city,
    zip,
    country,
    phone,
    status,
    totalPrice,
  } = req.body;

  try {
    const orderItemsPromise = Promise.all(
      orderItems.map(async (item) => {
        let newOrderItem = await OrderItem.create({
          quantity: item.quantity,
          product: item.product,
        });
        return newOrderItem._id;
      })
    );

    const orderItemsIds = await orderItemsPromise;

    const order = await Order.create({
      orderItems: orderItemsIds,
      shippingAddress,
      city,
      zip,
      country,
      phone,
      status,
      totalPrice,
      user: req.auth.userId,
    });

    if (!order) {
      return res.status(500).json({ message: "The order cannot be created!" });
    }

    return res.status(201).json({
      message: "Order created",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Oh! Sorry something went wrong on the server",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      // .populate({ path: "orderItems", populate: "product" })
      .populate("user", "name email ")
      .sort({ dateOrdered: -1 });
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Oh! Sorry something went wrong on the server",
    });
  }
});


router.get("/get/count", async (req, res) => {
  try{

    const count = await Order.count();

    return res.status(200).json({message: true, total: count})

  }catch(err){
    return res.status(500).json({
      success: false,
      message: "Oh! Sorry something went wrong on the server",
      error: err,
    });
  }
})

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "The Id is Invalid" });
  }

  try {
    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate({
        path: "orderItems",
        populate: { path: "product", populate: "category" },
      });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: `Cannot given Order with ID ${id}` });
    }

    return res.status(200).json({ success: true, data: order });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Oh! Sorry something went wrong on the server",
      error: err,
    });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "The Id is Invalid" });
  }

  const { status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order cannot be updated!, not found",
      });
    }

    return res.status(200).json({ success: true, data: order });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Oh! Sorry something went wrong on the server",
      error: err,
    });
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
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order cannot be updated!, not found",
      });
    }

    order.orderItems.map(async (item) => {
      await OrderItem.findByIdAndRemove(item);
    });

    await Order.findByIdAndRemove(id);

    return res.status(200).json({ message: "Order deleted" });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Oh! Sorry something went wrong on the server",
      error: err,
    });
  }
});

module.exports = router;
