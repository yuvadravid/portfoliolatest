const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
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

const Skill = mongoose.model("Skill", skillSchema);

module.exports = Skill;
