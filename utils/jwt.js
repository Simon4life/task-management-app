const jwt = require("jsonwebtoken");

const createJWT = async ({payload}) => {
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
);
  return token
}


const addCookiesToResponse = ({res, user}) => {
  const accessToken = createJWT({payload: {user}});

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + 900)
  })

}

module.exports = {createJWT, addCookiesToResponse}