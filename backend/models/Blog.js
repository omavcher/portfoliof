// models/Blog.js
const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() }, 
  publish_date: { type: Date, default: Date.now },
  title: { type: String, required: true },
  short_description: { type: String, required: true },
  thumbnail: { type: String, required: true },
  keywords: [{ type: String }],
  reading_time: { type: String, required: true },
  chai: { type: Number, default: 0 },
  content: {
    sections: [{
      id: { type: String, required: true },
      key: { type: String, required: true },
      label: { type: String, required: true },
      text: { type: String },
      links: [{
        id: String,
        url: String,
        text: String
      }],
      images: [{
        id: String,
        url: String
      }],
      codeSnippets: [{
        id: String,
        content: String
      }]
    }]
  }
});

module.exports = mongoose.model("Blog", BlogSchema);