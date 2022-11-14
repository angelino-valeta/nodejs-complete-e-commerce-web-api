const express = require("express");
const Order = require("../models/order");
const router = express.Router();


router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        data: []
    })
})

module.exports = router;