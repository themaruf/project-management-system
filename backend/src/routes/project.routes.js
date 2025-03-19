const express = require("express");
const router = express.Router();
const Project = require("../models/project.model");
const Task = require("../models/task.model");
const authMiddleware = require("../middleware/auth.middleware");
const { emitProjectUpdate } = require("../services/socket.service");

router.use(authMiddleware);

router.get("/search", async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const query = { owner: req.user.userId };

    if (status && status !== "") {
      query.status = status;
    }

    if (search && search.trim() !== "") {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [projects, total] = await Promise.all([
      Project.find(query)
        .populate("owner", "name email")
        .populate("team", "name email")
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Project.countDocuments(query),
    ]);

    res.json({
      projects,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Error searching projects" });
  }
});

router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.userId })
      .populate("owner", "name email")
      .populate("team", "name email");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user.userId,
    })
      .populate("owner", "name email")
      .populate("team", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      owner: req.user.userId,
    });
    await project.save();

    emitProjectUpdate(project._id, { type: "created", project });

    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    Object.assign(project, req.body);
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const tasksCount = await Task.countDocuments({ project: req.params.id });
    if (tasksCount > 0) {
      return res.status(400).json({
        message:
          "Cannot delete a project that has tasks. Please delete all tasks first.",
      });
    }

    await project.deleteOne();
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
