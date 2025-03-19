const express = require("express");
const router = express.Router();
const Project = require("../models/project.model");
const Task = require("../models/task.model");
const authMiddleware = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.get("/stats", async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.userId });
    const projectStats = {
      total: projects.length,
      planning: projects.filter((p) => p.status === "planning").length,
      inProgress: projects.filter((p) => p.status === "in-progress").length,
      completed: projects.filter((p) => p.status === "completed").length,
    };

    const tasks = await Task.find({
      project: { $in: projects.map((p) => p._id) },
    });

    const taskStats = {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "todo").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      completed: tasks.filter((t) => t.status === "completed").length,
    };

    const recentProjects = await Project.find({ owner: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(1)
      .populate("owner", "name email");

    res.json({
      projectStats,
      taskStats,
      recentProjects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
