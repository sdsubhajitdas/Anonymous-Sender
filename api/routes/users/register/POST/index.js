"use strict";

const _ = require("lodash");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const User = require("../../../../models/User");
const logger = require("../../../../utils/logger");
const { registrationValidation } = require("../../../../utils/validation");
const { startDatabaseConnection } = require("../../../../utils/database");

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
    let { error } = registrationValidation(requestBody);

    // Checking for errors.
    if (!_.isEmpty(error)) {
      response = {
        statusCode: 400,
        errorCode: "ValidationError",
        body: JSON.stringify(_.get(error, "details[0].message")),
      };
      throw "ValidationError: " + response.body;
    }

    // Checking for already existing user.
    let userExists = await User.findOne({ email: requestBody.email });
    if (userExists) {
      response = {
        statusCode: 400,
        errorCode: "UserAlreadyExistsError",
        body: JSON.stringify("User with this email already exits"),
      };
      throw "UserAlreadyExistsError: " + response.body;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(requestBody.password, salt);

    const user = new User({
      name: requestBody.name,
      email: requestBody.email,
      password: hashedPassword,
    });

    let savedUser = await user.save();

    // Sending only the fields that are required
    savedUser = {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      createdAt: savedUser.createdAt,
    };

    response = {
      statusCode: 201,
      body: JSON.stringify(savedUser),
    };
  } catch (error) {
    logger.error(error);
  } finally {
    await mongoose.connection.close();
    logger.info("Database connection closed");
    return response;
  }
};
