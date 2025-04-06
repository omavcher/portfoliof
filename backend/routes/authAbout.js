const express = require("express");
const portfolioController = require("../controllers/portfolioController");

const router = express.Router();

// Portfolio routes
router.get("/personal-info", portfolioController.getPortfolio);
router.get("/resume", portfolioController.getResume);
router.get("/about", portfolioController.getAbout);
router.get("/projects", portfolioController.getAllProjects);
router.get("/blog/overview", portfolioController.getBlogOverview);

// Personal Info routes
router.put("/personal-info", portfolioController.UpdateAbout);

// Project routes
router.post("/projects", portfolioController.CreateProject);
router.get("/projects/:id", portfolioController.getProjectById);
router.put("/projects/:id", portfolioController.updateProjectById);
router.delete("/projects/:id", portfolioController.deleteProjectById);

// Blog routes

router.get("/blogs", portfolioController.GetAllBlogs); // Legacy endpoint
router.post("/blogs/create", portfolioController.CreateBlog); // Legacy endpoint
router.get("/blogs/:id", portfolioController.getBlogById);
router.put("/blogs/edit/:id", portfolioController.updateBlog);
router.delete("/blogs/:id", portfolioController.deleteBlogById);
router.put("/blogs/chai/:id", portfolioController.updateChai);
router.get("/blogs/random/:id", portfolioController.getRandomBlogs);

// Guestbook routes
router.post("/guestbook", portfolioController.saveMessage);
router.get("/guestbook", portfolioController.getMessages);

module.exports = router;