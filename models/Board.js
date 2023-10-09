const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
  },
  description: {
    type: String,
    required: [true, "Please provide a short description"],
  },
  subtasks: {
    type: Array,
    required: [true, "Please Provide subtasks"],
  },
  status: {
    type: String,
    enum: ["Todo", "Doing", "Done"],
    required: false,
    default: "Todo",
  },
});

const Task = mongoose.model("Task", taskSchema);

const BoardSchema = new mongoose.Schema(
  {
    boardTitle: {
      type: String,
      required: [true, "must provide board title"],
      trim: true,
      maxLength: [20, "name cannot be more than 20 character"],
    },
    tasks: {
      type: [taskSchema],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
  },
  { timestamps: true }
);

const Board = mongoose.model("Board", BoardSchema);

module.exports = { Board, Task };
