const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("meet", userSchema);