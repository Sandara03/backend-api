const Joi = require("joi");
const Task = require("../models/Task");


const taskSchema = Joi.object({
  title: Joi.string().min(1).max(100).required().messages({
    "string.max": "Title cannot exceed 100 characters",
    "any.required": "Task title is required",
  }),
  description: Joi.string().max(500).optional().allow(""),
  status: Joi.string()
    .valid("pending", "in-progress", "completed")
    .optional()
    .messages({
      "any.only": "Status must be pending, in-progress, or completed",
    }),
  priority: Joi.string().valid("low", "medium", "high").optional().messages({
    "any.only": "Priority must be low, medium, or high",
  }),
  dueDate: Joi.date().iso().optional().allow(null),
});

const updateTaskSchema = taskSchema.fork(["title"], (schema) =>
  schema.optional()
);



/**
 * @route   POST /api/tasks
 * @desc    Create a new task for the authenticated user
 * @access  Private
 */
const createTask = async (req, res) => {
  try {
    const { error, value } = taskSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((d) => d.message);
      return res.status(400).json({ success: false, errors });
    }

    const task = await Task.create({
      ...value,
      user: req.user._id, // Link task to the authenticated user
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully.",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for the authenticated user (with filtering & pagination)
 * @access  Private
 */
const getTasks = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10, sort = "-createdAt" } = req.query;

    // Build filter — always scope to current user
    const filter = { user: req.user._id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const skip = (Number(page) - 1) * Number(limit);

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Task.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a single task by ID (must belong to authenticated user)
 * @access  Private
 */
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id, // Ensure user can only access their own tasks
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid task ID." });
    }
    console.error("Get task error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task (must belong to authenticated user)
 * @access  Private
 */
const updateTask = async (req, res) => {
  try {
    const { error, value } = updateTaskSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((d) => d.message);
      return res.status(400).json({ success: false, errors });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, // Scoped to user
      value,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      task,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid task ID." });
    }
    console.error("Update task error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task (must belong to authenticated user)
 * @access  Private
 */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id, // Scoped to user
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid task ID." });
    }
    console.error("Delete task error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
