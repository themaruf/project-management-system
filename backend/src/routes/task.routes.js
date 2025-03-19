const express = require("express");
const router = express.Router();
const Task = require("../models/task.model");
const authMiddleware = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("project", "title")
      .populate("assignee", "name email");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/project/:projectId", async (req, res) => {
  try {
    const tasks = await Task.find({
      project: req.params.projectId,
    }).populate("assignee", "name email");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
    })
      .populate("project", "title")
      .populate("assignee", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
