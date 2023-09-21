const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const {
  CreateCustomError,
  createCustomError,
} = require("../errors/custom-error");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "please provide values" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "User Not found" });
  }

  bcrypt.compare(password, user.password, function (err, result) {
    if (err) {
      console.log(err);
      res.send("Error");
    }
    if (result) {
      jwt.sign(
        { name: user.name, userId: user._id },
        process.env.JWT_SECRET,
        function (err, token) {
          if (err) {
            createCustomError(
              "There was an error validating this user",
              StatusCodes.BAD_REQUEST
            );
          }
          return res.status(200).json({ name: user.name, token: token });
        }
      );
    } else {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Password does not match" });
    }
  });
};

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.send("Please provide values");
  }
  const user = await User.create({ name, email, password });
  jwt.sign(
    { name: user.name, userId: user._id },
    process.env.JWT_SECRET,
    function (err, token) {
      if (err) {
        createCustomError(
          "There was an error validating this user",
          StatusCodes.BAD_REQUEST
        );
      }
      res.status(200).json({ name: user.name, token: token });
    }
  );
};

module.exports = { login, register };
