const express = require("express");
const router = express.Router();
const {
  getBoards,
  getSingleBoard,
  deleteBoard,
  updateBoard,
  createBoard,
} = require("../controllers/boards");

router.get("/", getBoards).post("/", createBoard);
router
  .get("/:id", getSingleBoard)
  .patch("/:id", updateBoard)
  .delete("/:id", deleteBoard);

module.exports = router;
