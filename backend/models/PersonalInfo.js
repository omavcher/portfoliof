// models/PersonalInfo.js
const mongoose = require("mongoose");

const PersonalInfoSchema = new mongoose.Schema({
  resume: { type: String, required: true },
  experience: {
    items: [{
      period: { type: String, required: true },
      role: { type: String, required: true },
      company: { type: String, required: true },
      logo: { type: String, required: true },
      link: { type: String, required: true },
      location: { type: String, required: true },
      description: { type: String, required: true },
      responsibilities: [{ type: String }],
      images: [{ type: String }],
      skills: [{ type: String }]
    }]
  },
  techStack: {
    frontend: {
      title: { type: String, required: true },
      items: [{
        name: { type: String, required: true },
        icon: { type: String, required: true }
      }]
    },
    backend: {
      title: { type: String, required: true },
      items: [{
        name: { type: String, required: true },
        icon: { type: String, required: true }
      }]
    },
    devops: {
      title: { type: String, required: true },
      items: [{
        name: { type: String, required: true },
        icon: { type: String, required: true }
      }]
    },
    dsa: {
      title: { type: String, required: true },
      items: [{
        name: { type: String, required: true },
        icon: { type: String, required: true }
      }]
    },
    ai: {
      title: { type: String, required: true },
      items: [{
        name: { type: String, required: true },
        icon: { type: String, required: true }
      }]
    }
  }
});

module.exports = mongoose.model("PersonalInfo", PersonalInfoSchema);

