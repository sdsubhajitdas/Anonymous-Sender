"use strict";

const _ = require("lodash");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../../../models/User");
const logger = require("../../../utils/logger");
const { startDatabaseConnection } = require("../../../utils/database");

module.exports.handler = async (event, context) => {
  let response = {};

  try {
    // DB connection checking
    await startDatabaseConnection();
    logger.info("Database connection successful");

    // Running validation on request body.
    let userId = _.get(event, "pathParameters.userId", null);

    // Checking for errors.
    if (_.isEmpty(userId)) {
      response = {
        statusCode: 400,
        errorCode: "ValidationError",
        body: "userId is missing",
      };
      throw response.errorCode + ": " + response.body;
    }

    // Checking for existing user.
    let user = await User.findOne({ _id: userId });

    if (!user) {
      response = {
        statusCode: 404,
        errorCode: "UserNotFound",
        body: "User does not exist",
      };
      throw response.errorCode + ": " + response.body;
    }

    response = {
      statusCode: 200,
      body: JSON.stringify({ _id: user._id, name: user.name }),
    };
  } catch (error) {
    // If query gives this error then it means id was wrong.
    if (_.get(error, "name") === "CastError") {
      response = {
        statusCode: 404,
        errorCode: "UserNotFound",
        body: "User does not exist",
      };
    }
    logger.error(error);
  } finally {
    await mongoose.connection.close();
    logger.info("Database connection closed");
    return response;
  }
};
