const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  school: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("classe", userSchema);
