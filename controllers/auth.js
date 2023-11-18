const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const {
  createCustomError,
} = require("../errors/custom-error");
const { addCookiesToResponse } = require("../utils/jwt");
const createTokenUser = require("../utils/createTokenUser");
const {createJWT} = require("../utils/jwt")
const Token = require("../models/Token");
const crypto = require("crypto");

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
      let existingToken = await Token.findOne({userId: tokenUser.userId});
      
      if(existingToken) {
        const {token}= existingToken;
        const accessToken = createJWT({
          payload: tokenUser,
          secret: process.env.ACCESS_TOKEN_SECRET,
          expiresIn: process.env.ACCESS_TOKEN_LIFETIME,
        });
        addCookiesToResponse({res, user: tokenUser, token});
        res
          .status(StatusCodes.OK)
          .json({ user: tokenUser, accessToken: accessToken });
      } else {
        res.status(StatusCodes.FORBIDDEN).json({message: "There was an error"})
      }
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
    res.status(StatusCodes.BAD_REQUEST).json({"msg": "email already exists"})
  }

  const user = await User.create({ name, email, password });
  const tokenUser = createTokenUser(user);
  
  const accessToken = createJWT({
    payload: tokenUser,
    secret: process.env.ACCESS_TOKEN_SECRET,
    expiresIn: process.env.ACCESS_TOKEN_LIFETIME,
  });
  const token = crypto.randomBytes(40).toString("hex");
  await Token.create({ token, userId: tokenUser.userId });
  addCookiesToResponse({ res, user: tokenUser, token });
  res.status(201).json({ user: tokenUser, accessToken });

};

const logout = async (req, res) => {

  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
 
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
}

module.exports = { login, register, logout };
