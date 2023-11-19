const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const {verifyUserToken} = require("../utils/jwt")
const User = require("../models/User");

const auth = async (req, res, next) => {
  const accessToken = req.headers.authorization.split(" ")[1];
  const refreshToken = req.signedCookies.refreshToken;

  if(!accessToken) {
    return res.status(StatusCodes.FORBIDDEN).json({message: "Invalid credentials"})
  }
  let payload;
  try {
    payload = verifyUserToken(accessToken, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({message: "Invalid credentials"})
  }

  if (payload && payload.exp) {
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTime) {
      payload = verifyUserToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const existingToken = await Token.findOne({ token: payload.token });
      if (!existingToken || !existingToken?.isValid) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid credentials" });
      }
      const user = await User.findOne({ email: payload.email });
      const tokenUser = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userId: user._id.toString(),
      };
      addCookieToResponse({ res, user: tokenUser, token: existingToken.token });
      req.user = tokenUser;
      return next();
    } else {
      req.user = { userId: payload.userId };
      return next();
    }
  } else {
    console.error("Invalid accessToken");
  }
};

module.exports = auth;
