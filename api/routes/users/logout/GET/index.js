"use strict";

const _ = require("lodash");
require("dotenv").config();
const logger = require("../../../../utils/logger");

module.exports.handler = async (event, context) => {
  let response;

  try {
    let cookies = _.get(event, "cookies", []);
    let refreshToken = _.find(cookies, (cookie) =>
      cookie.startsWith("refreshToken=")
    );

    refreshToken = !_.isEmpty(refreshToken) ? refreshToken.split("=")[1] : "";

    if (_.isEmpty(refreshToken)) {
      response = {
        statusCode: 204,
        errorCode: "RefreshTokenNotFoundError",
        body: JSON.stringify("Refresh token missing"),
      };
      throw response.errorCode + ": " + response.body;
    }

    let expiryDate = new Date();
    expiryDate.setDate(
      expiryDate.getDate() +
        parseInt(process.env.REFRESH_TOKEN_COOKIE_EXPIRE_DAYS)
    );
    response = {
      headers: {
        "Set-Cookie": `refreshToken=; HttpOnly; Secure; Path=/; Expires=${expiryDate.toUTCString()}; SameSite=None`,
      },
      statusCode: 200,
    };
  } catch (error) {
    logger.error(error);
  } finally {
    return response;
  }
};
