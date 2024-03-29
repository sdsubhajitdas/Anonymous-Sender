const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { verifyAccessToken } = require("./jwt");
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
    user = verifyAccessToken(accessToken);
    return { error, user };
  } catch (error) {
    const errorMessage = {
      JsonWebTokenError: "Invalid authentication token",
      TokenExpiredError: "Expired authentication token",
    };

    if (
      ["JsonWebTokenError", "TokenExpiredError"].includes(
        _.get(error, "name", "")
      )
    ) {
      error = {
        statusCode: 403,
        errorCode: "AuthenticationError",
        body: JSON.stringify(errorMessage[_.get(error, "name", "")]),
      };
      return { error, user };
    }
    throw error;
  }
}

module.exports = {
  isAuthenticated,
};
