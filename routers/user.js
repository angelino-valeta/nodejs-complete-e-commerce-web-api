const express = require("express");
const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const router = express.Router();
const mongoose = require("mongoose");
const errorHandler = require("../helpers/error-handler")

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


		const userExist = await User.findOne({email})
		
		if(userExist){
			return res.status(400).json({success: false, message: "Account already with this email, please try again"})
		}

    const user = await User.create({
      name,
      email,
      passwordHash: bcrypt.hashSync(password, 10),
      street,
      phone,
      apartment,
      city,
      zip,
      country,
      isAdmin,
    });

    return res.status(201).json({ success: true, message: "User created" });
  } catch (err) {
    return errorHandler(err, req, res)
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

router.get("/get/count", async(req, res) => {
	try{

		const totalUser = await User.count();

		return res.status(200).json({success: true, data: {
			total: totalUser
		}})

	}catch(err){
		return res.status(500).json({success: false, error: err})
	}
})

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

router.put("/:id", async (req, res) => {
	const { id } = req.params;

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

	try{

		if(!mongoose.isValidObjectId(id)){
			return res.status(400).json({success: false, message:" The Id is Invalid"});
		}

		const userExist = await User.findById(id);

		if(!userExist){
			return res.status(404).json({success: false, message: `The user with the given ID ${id}, was not found`})
		}

		let newPassword;

		if(password){
			newPassword = bcrypt.hashSync(password, 10)
		}else{
			newPassword = userExist.passwordHash;	
		}

		const user = await User.findByIdAndUpdate(id, {
			name,
      email,
      passwordHash: newPassword,
      street,
      phone,
      apartment,
      city,
      zip,
      country,
      isAdmin,
		}, {new: true})

		return res.status(200).json({ success: true, message: "User Updated" })

	}catch(err){
		return res.status(500).json({success: false, error: err});
	}
})

router.delete("/:id", async (req, res)=> {
	const { id } = req.params;

	try{
		if(!mongoose.isValidObjectId(id)){
			return res.status(400).json({success: false, message: "The Id is invalid"})
		}

		const user = await User.findByIdAndRemove(id);

		if(!user){
			return res.status(404).json({success: false, message: `The user with the given ID ${id}, was not found`})
		}

		return res.status(200).json({success: true, message: "User deleted"});


	}catch(err){
		return res.status(500).json({success: false, error: err})
	}
})

module.exports = router;
