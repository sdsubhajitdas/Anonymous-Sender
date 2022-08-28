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

    let messages = await Message.find({ userId: user._id }).sort({
      createdAt: -1,
    });

    response = {
      statusCode: 200,
      body: JSON.stringify(messages),
    };
  } catch (error) {
    logger.error(error);
  } finally {
    await mongoose.connection.close();
    logger.info("Database connection closed");
    return response;
  }
};
