const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const PersonalInfo = require("../models/PersonalInfo");
const Blog = require("../models/Blog");
const Project = require("../models/Project");
const Guestbook = require("../models/guestbookModel");

exports.UpdateAbout = async (req, res) => {
  try {
    const personalInfoData = req.body;

    let personalInfo = await PersonalInfo.findOne();
    if (!personalInfo) {
      personalInfo = new PersonalInfo(personalInfoData);
    } else {
      // Update existing personal info
      Object.assign(personalInfo, personalInfoData);
    }

    await personalInfo.save();
    res.status(200).json({ message: "Personal info updated successfully", personalInfo });
  } catch (error) {
    res.status(500).json({ message: "Error updating personal info", error: error.message });
  }
};

exports.CreateBlog = async (req, res) => {
  try {
    const blogData = req.body; // Assuming frontend sends in this format
    const newBlog = new Blog(blogData);
    await newBlog.save();

    res.status(201).json({ message: "Blog created successfully!", blog: newBlog });
  } catch (error) {
    console.error("Error Creating Blog:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.CreateProject = async (req, res) => {
  try {
    const projectData = req.body;

    if (!projectData || Object.keys(projectData).length === 0) {
      return res.status(400).json({ message: "Project data is required" });
    }

    const newProject = new Project(projectData);
    await newProject.save();

    res.status(201).json({ message: "Project created successfully!", project: newProject });
  } catch (error) {
    console.error("Error Creating Project:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const project = await Project.findByIdAndUpdate(id, updatedData, { new: true });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error Deleting Project:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ message: "Blog fetched successfully", blog });
  } catch (error) {
    console.error("Error Fetching Blog:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.deleteBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error Deleting Blog:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getPortfolio = async (req, res) => {
  try {
    const personalInfo = await PersonalInfo.findOne();
    const blogs = await Blog.find();
    const projects = await Project.find();

    const portfolio = {
      personalInfo: personalInfo || {},
      blogs,
      projects
    };

    res.status(200).json(portfolio);
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getRandomBlogs = async (req, res) => {
  try {
    const { id } = req.params;
    const blogs = await Blog.find({ _id: { $ne: id } });

    if (blogs.length < 2) {
      return res.status(404).json({ message: "Not enough blogs available" });
    }

    // Shuffle and pick two random blogs
    const shuffledBlogs = blogs.sort(() => Math.random() - 0.5);
    const randomBlogs = shuffledBlogs.slice(0, 2).map(blog => ({
      id: blog._id,
      title: blog.title,
      short_description: blog.short_description,
      thumbnail: blog.thumbnail
    }));

    res.status(200).json({ blogs: randomBlogs });
  } catch (error) {
    res.status(500).json({ message: "Error fetching random blogs", error: error.message });
  }
};

exports.getAbout = async (req, res) => {
  try {
    const personalInfo = await PersonalInfo.findOne();
    if (!personalInfo) {
      return res.status(404).json({ message: "Personal info not found" });
    }

    res.status(200).json({ aboutInfo: personalInfo });
  } catch (error) {
    res.status(500).json({ message: "Error fetching about information", error: error.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: "No projects found" });
    }

    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error: error.message });
  }
};

exports.getBlogOverview = async (req, res) => {
  try {
    const blogs = await Blog.find();
    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ message: "No blogs found" });
    }

    const blogOverview = blogs.map(blog => ({
      _id: blog._id,
      publish_date: blog.publish_date,
      title: blog.title,
      short_description: blog.short_description,
      thumbnail: blog.thumbnail,
      keywords: blog.keywords,
      reading_time: blog.reading_time
    }));

    res.status(200).json({ blogOverview });
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog overview", error: error.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const blog = await Blog.findByIdAndUpdate(id, updatedData, { new: true });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateChai = async (req, res) => {
  const { id } = req.params;
  const { chai } = req.body;

  try {
    const blog = await Blog.findByIdAndUpdate(id, { chai }, { new: true });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ message: "Chai count updated successfully", blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.saveMessage = async (req, res) => {
  try {
    const newMessage = new Guestbook(req.body);
    await newMessage.save();
    res.status(201).json({ success: true, message: "Message saved!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving message", error });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Guestbook.find().sort({ date: -1 });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching messages", error });
  }
};


exports.GetAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ })
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching ", error });
  }
};




exports.getResume = async (req, res) => {
  try {
    const data = await PersonalInfo.findOne({}); // use findOne if only one document exists
    if (!data) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }
    const resume = data.resume;
    res.status(200).json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching resume", error });
  }
};
