const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const Task = require("../../models/task.model");

const app = express();
app.use(express.json());

jest.mock("../../middleware/auth.middleware", () => (req, res, next) => {
  req.user = { userId: "mockUserId" };
  next();
});

const taskRoutes = require("../task.routes");
app.use("/api/tasks", taskRoutes);

describe("GET /api/tasks/project/:projectId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return tasks for a specific project", async () => {
    const mockTasks = [
      {
        _id: "task1",
        title: "Test Task 1",
        assignee: {
          _id: "mockUserId",
          name: "Test User",
          email: "test@example.com",
        },
      },
    ];

    Task.find = jest.fn().mockReturnThis();
    Task.populate = jest.fn().mockResolvedValue(mockTasks);

    const response = await request(app)
      .get("/api/tasks/project/mockProjectId")
      .expect(200);

    expect(response.body).toEqual(mockTasks);
    expect(Task.find).toHaveBeenCalledWith({
      project: "mockProjectId",
      assignee: "mockUserId",
    });
  });

  it("should handle database errors", async () => {
    const errorMessage = "Database error";

    Task.find = jest.fn().mockImplementation(() => {
      throw new Error(errorMessage);
    });

    const response = await request(app)
      .get("/api/tasks/project/mockProjectId")
      .expect(500);

    expect(response.body).toEqual({
      message: errorMessage,
    });
  });

  it("should return empty array when no tasks found", async () => {
    Task.find = jest.fn().mockReturnThis();
    Task.populate = jest.fn().mockResolvedValue([]);

    const response = await request(app)
      .get("/api/tasks/project/mockProjectId")
      .expect(200);

    expect(response.body).toEqual([]);
  });
});
