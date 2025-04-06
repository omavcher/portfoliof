// models/Project.js
const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() }, 
  color: { type: String, required: true },
  secondary: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  github: { type: String },
  features: [{ type: String }],
  tagline: { type: String },
  live_link: { type: String },
  is_live_link: { type: Number, required: true },
  technologies: [{ type: String }]
});

module.exports = mongoose.model("Project", ProjectSchema);