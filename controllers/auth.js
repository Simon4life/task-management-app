const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const {
  createCustomError,
} = require("../errors/custom-error");
const { addCookiesToResponse } = require("../utils/jwt");
const createTokenUser = require("../utils/createTokenUser");

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

  bcrypt.compare(password, user.password, async function (err, result) {
    if (err) {
      console.log(err);
      res.send("Error");
    }
    if (result) {
      const tokenUser = createTokenUser(user);
      addCookiesToResponse({res, user: tokenUser});
      res.status(StatusCodes.OK).json({ user: tokenUser });

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
  const emailAlreadyExists = await User.findOne({email});

  if(emailAlreadyExists) {
    res.status(StatusCodes.BAD_GATEWAY).json({"msg": "email already exists"})
  }

  const user = await User.create({ name, email, password });
  const tokenUser = createTokenUser(user);
  addCookiesToResponse({res, user: tokenUser});

  res.status(201).json({ user: tokenUser });

};

const logout = async (req, res) => {

  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
 
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
}

module.exports = { login, register, logout };
