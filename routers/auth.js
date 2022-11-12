const express = require("express");
const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try{
		
		const user = await User.findOne({email: email});
	
		if(!user){
			return res.status(400).json({ success: false, message: "Email or password is wrong" })
		}

		if(user && bcrypt.compareSync(password, user.passwordHash)){
      const secret = process.env.SECRET
			const token = jwt.sign({userId: user.id}, secret, {expiresIn: "1d"})
			return res.status(200).json({success: true, data: {
				user: {name: user.name, email: user.email},
				token
			}})
		}

		return res.status(400).json({ success: false, message: "Email or password is wrong" })

	}catch(err){
		return res.status(500).json({success: false, error: err})
	}

});

router.post("/register", async (req, res) => {
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

     await User.create({
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
    return res.status(500).json({ success: false, error: err });
  }
});

module.exports = router;
