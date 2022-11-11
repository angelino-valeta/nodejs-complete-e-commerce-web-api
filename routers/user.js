const express = require("express");
const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const router = express.Router();
const mongoose = require("mongoose");

router.post("/", async (req, res) => {
  const {
    name,
    email,
    password,
    street,
    phone,
    apartment,
    city,
    zip,
    country,
    isAdmin,
  } = req.body;

  try {
    const user = await User.create({
      name,
      email,
      passwordHash: bcrypt.hashSync(password),
      street,
      phone,
      apartment,
      city,
      zip,
      country,
      isAdmin,
    });

    return res.status(201).json({ success: true, data: user });
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");

    return res.status(200).json({ success: true, data: users });
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "The Id is Invalid" });
    }

    const user = await User.findById(id).select("-passwordHash");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `The user with the given ID ${id}, was not found`,
      });
    }

    return res.status(200).json({ success: true, message: user });
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
});

module.exports = router;
