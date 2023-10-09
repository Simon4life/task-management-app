const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const {verifyUserToken} = require("../utils/jwt")

const auth = async (req, res, next) => {
  const {accessToken} = req.signedCookies;
  if(!accessToken) {
    res.status(StatusCodes.BAD_REQUEST).json({message: "Invalid credentials"})
  }

  const {name, email, userId} = verifyUserToken(process.env.JWT_SECRET);

  if(name, email, userId) {
    try {
      req.user = { name, email, userId };
      next();
    } catch (error) {
      console.log(error)
    }
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({message: "Error trying to authenticate user"});
  }
};

module.exports = auth;
