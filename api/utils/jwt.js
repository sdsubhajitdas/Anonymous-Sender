const jwt = require("jsonwebtoken");
require("dotenv").config();

function filterUserData(user) {
  return {
    _id: user._id,
    email: user.email,
    name: user.name,
  };
}

export function getAccessToken(user) {
  user = filterUserData(user);

  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15s",
  });
}

export function getRefreshToken(user) {
  user = filterUserData(user);

  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "10m",
  });
}

export function verifyAccessToken(accessToken) {
  return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
}

export function verifyRefreshToken(refreshToken) {
  return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
}
