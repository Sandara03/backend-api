const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/auth");

// All task routes require authentication
router.use(protect);

router.route("/")
  .get(getTasks)    // GET  /api/tasks
  .post(createTask); // POST /api/tasks

router.route("/:id")
  .get(getTaskById)    // GET    /api/tasks/:id
  .put(updateTask)     // PUT    /api/tasks/:id
  .delete(deleteTask); // DELETE /api/tasks/:id

module.exports = router;
