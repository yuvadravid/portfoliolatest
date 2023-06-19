const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
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
  },
  url: {
    type: String,
  }
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
