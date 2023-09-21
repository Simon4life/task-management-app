const { Board } = require("../models/Board");
const asyncWrapper = require("../middleware/async");
const { StatusCodes } = require("http-status-codes");

const getBoards = asyncWrapper(async (req, res, next) => {
  const { userId } = req.user;
  const boards = await Board.find({ createdBy: userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ boards: boards, count: boards.length });
});

const createBoard = asyncWrapper(async (req, res) => {
  req.body.createdBy = req.user.userId;

  const board = await Board.create(req.body);
  res.status(StatusCodes.CREATED).json(board);
});

const getSingleBoard = asyncWrapper(async (req, res) => {
  const boardId = req.params.id;
  const { userId } = req.user;
  const board = Board.findOne({ createdBy: userId, _id: boardId });
  if (!board) {
    return res.status(404).json({ message: "no board found" });
  }
  res.status(StatusCodes.OK).json({ board });
});

const updateBoard = asyncWrapper(async (req, res, next) => {
  const {
    body: { tasks, boardTitle },
    user: { userId },
    params: { id: boardId },
  } = req;
  if (!boardTitle || !tasks) {
    return res.status(401).send("Bad request");
  }
  const board = await Board.findByIdAndUpdate(
    { _id: boardId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!board) {
    return res.status(404).send("No board found");
  }
  res.status(StatusCodes.OK).json({ job });
});

const deleteBoard = asyncWrapper(async (req, res) => {
  const {
    user: { userId },
    params: { id: boardId },
  } = req;
  const board = await Board.findByIdAndRemove({
    _id: boardId,
    createdBy: userId,
  });
  if (!board) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).send();
});

module.exports = {
  getBoards,
  getSingleBoard,
  deleteBoard,
  updateBoard,
  createBoard,
};
