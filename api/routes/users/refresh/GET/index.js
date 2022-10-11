"use strict";

const _ = require("lodash");
require("dotenv").config();

const logger = require("../../../../utils/logger");
const { verifyRefreshToken, getAccessToken } = require("../../../../utils/jwt");

module.exports.handler = async (event, context) => {
  let response;

  try {
    let cookies = _.get(event, "cookies", []);
    let refreshToken = _.find(cookies, (cookie) =>
      cookie.startsWith("refreshToken=")
    );

    if (_.isEmpty(refreshToken)) {
      response = {
        statusCode: 403,
        errorCode: "RefreshTokenNotFoundError",
        body: JSON.stringify("Refresh token missing"),
      };
      throw response.errorCode + ": " + response.body;
    }

    refreshToken = refreshToken.split("=")[1];

    const decodedUser = verifyRefreshToken(refreshToken);
    const accessToken = getAccessToken(decodedUser);

    response = {
      statusCode: 200,
      body: JSON.stringify({
        _id: decodedUser._id,
        email: decodedUser.email,
        name: decodedUser.name,
        accessToken,
      }),
    };
  } catch (error) {
    logger.error(error);
    response = {
      statusCode: 403,
    };
  } finally {
    return response;
  }
};
