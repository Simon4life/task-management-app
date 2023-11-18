const jwt = require("jsonwebtoken");

const createJWT = ({payload, secret, expiresIn}) => {
  const token = jwt.sign(payload, secret, {
    expiresIn
  });
  return token
}

const verifyUserToken = (token, secret) => {
  return jwt.verify(token, secret);
}

const addCookiesToResponse = ({res, user,  token}) => {
  const refreshToken = createJWT({
    payload: { token, email: user.email },
    secret: process.env.REFRESH_TOKEN_SECRET,
    expiresIn: process.env.REFRESH_TOKEN_LIFETIME
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 30),
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    signed: true,
  });
  
}

module.exports = {createJWT, addCookiesToResponse, verifyUserToken}