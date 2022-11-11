const express = require("express");
const { User } = require("../models/user");
const bcrypt = require("bcryptjs");

const router = express.Router();

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
		isAdmin
	} = req.body

	try{

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
			isAdmin
		})

		return res.status(201).json({success: true, data: user})
	}catch(err){
		return res.status(500).json({success: false, error: err})
	}

})

router.get("/", async (req, res) => {
  try {
		const users = await User.find();

		return res.status(200).json({success: true, data: users})
		
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
});

module.exports = router;
