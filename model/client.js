const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    unique: true,
    required: true,
  },
  banner: {
    type: String,
    required: true,
  }
});

const Client = mongoose.model("client", clientSchema);

module.exports = Client;
