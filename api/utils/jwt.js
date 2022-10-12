const jwt = require("jsonwebtoken");
require("dotenv").config();

function filterUserData(user) {
  return {
    _id: user._id,
    email: user.email,
    name: user.name,
  };
}

function getAccessToken(user) {
  user = filterUserData(user);

  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE_SECONDS}s`,
  });
}

function getRefreshToken(user) {
  user = filterUserData(user);

  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: `${process.env.REFRESH_TOKEN_EXPIRE_SECONDS}s`,
  });
}

function verifyAccessToken(accessToken) {
  return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
}

function verifyRefreshToken(refreshToken) {
  return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
}

module.exports = {
  getAccessToken,
  getRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
