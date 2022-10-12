"use strict";

const mongoose = require("mongoose");
const _ = require("lodash");
require("dotenv").config();

const Message = require("../../../models/Message");
const User = require("../../../models/User");
const logger = require("../../../utils/logger");
const { messageValidation } = require("../../../utils/validation");
const { startDatabaseConnection } = require("../../../utils/database");

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
    let { error } = messageValidation(requestBody);

    // Checking for errors.
    if (!_.isEmpty(error)) {
      response = {
        statusCode: 400,
        errorCode: "ValidationError",
        body: JSON.stringify(_.get(error, "details[0].message")),
      };
      throw response.errorCode + ": " + response.body;
    }

    let existingUser = await User.findOne({ _id: requestBody.userId });

    if (!existingUser) {
      response = {
        statusCode: 400,
        errorCode: "ValidationError",
        body: JSON.stringify('"userId" is invalid'),
      };
      throw response.errorCode + ": " + response.body;
    }

    let message = new Message({
      userId: requestBody.userId,
      sender: _.get(requestBody, "sender", null),
      message: requestBody.message,
    });

    let savedMessage = await message.save();

    response = {
      statusCode: 201,
      body: JSON.stringify(savedMessage),
    };
  } catch (error) {
    logger.error(error);
  } finally {
    await mongoose.connection.close();
    logger.info("Database connection closed");
    return response;
  }
};
