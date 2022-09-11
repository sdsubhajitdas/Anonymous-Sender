"use strict";

const _ = require("lodash");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../../../../models/User");
const logger = require("../../../../utils/logger");
const { loginValidation } = require("../../../../utils/validation");
const { startDatabaseConnection } = require("../../../../utils/database");
const { getAccessToken, getRefreshToken } = require("../../../../utils/jwt");

module.exports.handler = async (event, context) => {
  let response;

  try {
    // DB connection checking
    await startDatabaseConnection();
    logger.info("Database connection successful");

    // Extracting parameters from request body.
    const requestBody = _.get(event, "body", null)
      ? JSON.parse(event.body)
      : {};

    // Running validation on request body.
    let { error } = loginValidation(requestBody);

    // Checking for errors.
    if (!_.isEmpty(error)) {
      response = {
        statusCode: 400,
        errorCode: "ValidationError",
        body: JSON.stringify(_.get(error, "details[0].message")),
      };
      throw "ValidationError: " + response.body;
    }

    // Checking for non-existing user.
    let user = await User.findOne({ email: requestBody.email });
    if (!user) {
      response = {
        statusCode: 400,
        errorCode: "AuthenticationError",
        body: JSON.stringify("Email or password is incorrect"),
      };
      throw "AuthenticationError: " + response.body;
    }

    const validPassword = await bcrypt.compare(
      requestBody.password,
      user.password
    );

    if (!validPassword) {
      response = {
        statusCode: 400,
        errorCode: "AuthenticationError",
        body: JSON.stringify("Email or password is incorrect"),
      };
      throw "AuthenticationError: " + response.body;
    }

    const accessToken = getAccessToken(user);
    const refreshToken = getRefreshToken(user);

    let expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);
    response = {
      headers: {
        "Set-Cookie": `refreshToken=${refreshToken}; HttpOnly; Secure; Path=/; Expires=${expiryDate.toUTCString()}`,
      },
      statusCode: 200,
      body: JSON.stringify({ ...user, accessToken }),
    };
  } catch (error) {
    logger.error(error);
  } finally {
    await mongoose.connection.close();
    logger.info("Database connection closed");
    return response;
  }
};
