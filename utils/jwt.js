const jwt = require("jsonwebtoken");

const createJWT = async ({payload}) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token
}

const verifyUserToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
}

const addCookiesToResponse = ({res, user}) => {
  const accessToken = createJWT({payload: {user}});

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + 1000 * 60 * 60)
  })

}

module.exports = {createJWT, addCookiesToResponse, verifyUserToken}