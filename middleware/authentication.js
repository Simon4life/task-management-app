const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const auth = async (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken || !authToken.startsWith("Bearer ")) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Authentication Invalid" });
  }
  const token = authToken.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        console.log(err);
      }
      req.user = { userId: decoded.userId, name: decoded.name };

      next();
    });
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = auth;
