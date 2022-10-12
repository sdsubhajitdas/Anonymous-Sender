"use strict";

const mongoose = require("mongoose");
const _ = require("lodash");
require("dotenv").config();

const Message = require("../../../models/Message");
const logger = require("../../../utils/logger");
const { isAuthenticated } = require("../../../utils/authenticator");
const { startDatabaseConnection } = require("../../../utils/database");

module.exports.handler = async (event, context) => {
  let response;

  try {
    // DB connection checking
    await startDatabaseConnection();
    logger.info("Database connection successful");

    // Checking for authentication
    let { error, user } = isAuthenticated(event.headers);
    if (error) {
      response = { ...error };
      throw error.errorCode + ": " + error.body;
    }

    // Running validation on request body.
    let messageId = _.get(event, "pathParameters.messageId", null);

    // Checking for errors.
    if (_.isEmpty(messageId)) {
      response = {
        statusCode: 400,
        errorCode: "ValidationError",
        body: "messageId is missing",
      };
      throw response.errorCode + ": " + response.body;
    }

    // Delete the message from database
    await Message.deleteOne({ _id: messageId });

    response = {
      statusCode: 202,
    };
  } catch (error) {
    if (_.get(error, "name", "") === "CastError") {
      response = {
        statusCode: 404,
        errorCode: "MessageNotFound",
        body: "Message does not exist",
      };
    }
    logger.error(error);
  } finally {
    await mongoose.connection.close();
    logger.info("Database connection closed");
    return response;
  }
};
