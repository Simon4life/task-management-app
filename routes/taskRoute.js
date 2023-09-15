const express = require("express");
const { getStatusText } = require("http-status-codes");
const router = express.Router();
const {
  addTask,
  getAllTasks,
  deleteTask,
  updateTask,
} = require("../controllers/tasks");

router.get("/:id", getAllTasks);
router.post("/:id", addTask);
router.delete("/:id/:taskId", deleteTask);
router.patch("/:id/:taskId", updateTask);
module.exports = router;
