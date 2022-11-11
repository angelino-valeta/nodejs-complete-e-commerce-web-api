const mongoose = require('mongoose');

function validateObjectId(id, res) {
  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "The Product Id is Invalid" });
  }
}

exports.validateObjectId = validateObjectId;
