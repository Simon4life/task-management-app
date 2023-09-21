const { Board, Task } = require("../models/Board");
const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../errors/custom-error");
const { StatusCodes } = require("http-status-codes");

const getAllTasks = asyncWrapper(async (req, res, next) => {
  const {
    user: { userId },
    params: { id: boardId },
  } = req;

  const tasks = await Board.find({ createdBy: userId, _id: boardId });
  if (!tasks) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "No task Found" });
  }
  
  const myTask = tasks.reduce((acc, curr) => {
    acc.push(...curr.tasks);
    return acc;
  }, []);

  res.status(StatusCodes.OK).json({ tasks: myTask });
});

const addTask = asyncWrapper(async (req, res, next) => {
  const {
    user: { userId },
    params: { id: boardId },
  } = req;
  const task = req.body;
  const tasks = await Board.findOneAndUpdate(
    { createdBy: userId, _id: boardId },
    {
      $addToSet: {
        tasks: task,
      },
    },
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.CREATED).json({ tasks });
});
const deleteTask = asyncWrapper(async (req, res, next) => {
  const {
    user: { userId },
    params: { id: boardId, taskId },
  } = req;

  const tasks = await Board.findOneAndUpdate(
    { createdBy: userId, _id: boardId },
    {
      $pull: {
        tasks: { _id: taskId },
      },
    }
  );
  res.status(StatusCodes.OK).json({ tasks });
});
const updateTask = asyncWrapper(async (req, res, next) => {
  const {
    user: { userId },
    params: { id: boardId, taskId },
  } = req;
  const newTask = req.body;

  if (!newTask)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide correct data" });

  const tasks = await Board.findOneAndUpdate(
    { createdBy: userId, _id: boardId, "tasks._id": taskId },
    { $set: { "tasks.$": newTask } }
  );
  if (tasks) {
    return res.status(StatusCodes.CREATED).json({ newTask });
  }
  res.status(StatusCodes.NOT_FOUND).json({ msg: "No Task found" });
});

module.exports = {
  getAllTasks,
  addTask,
  deleteTask,
  updateTask,
};
