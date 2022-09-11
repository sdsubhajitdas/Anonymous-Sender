const _ = require("lodash");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function isAuthenticated(headers) {
  let error, user;
  let accessToken = _.get(headers, "authorization", null);
  accessToken = !_.isEmpty(accessToken)
    ? accessToken.split(" ")[1]
    : accessToken;

  if (_.isEmpty(accessToken)) {
    error = {
      statusCode: 401,
      errorCode: "AuthenticationError",
      body: JSON.stringify("Authentication token missing"),
    };
    return { error, user };
  }

  try {
    user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    return { error, user };
  } catch (error) {
    if (_.get(error, "name", "") === "JsonWebTokenError") {
      error = {
        statusCode: 403,
        errorCode: "AuthenticationError",
        body: JSON.stringify("Invalid authentication token"),
      };
      return { error, user };
    }
    throw error;
  }
}

module.exports = {
  isAuthenticated,
};
