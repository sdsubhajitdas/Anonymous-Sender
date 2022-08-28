import * as _ from "lodash";

export function loginValidation({ email, password }) {
  let error = {};

  // Email Validation
  // 1. Required
  // 2. Is Valid
  if (_.isEmpty(email)) {
    _.set(error, "email", "Email is required");
  } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    _.set(error, "email", "Email is invalid");
  }

  // Password Validation
  // 1. Required
  if (_.isEmpty(password)) {
    _.set(error, "password", "Password is required");
  }
  return error;
}

export function registerValidation({ name, email, password, confirmPassword }) {
  let error = {};

  // Name validation
  // 1. Required
  // 2. Min Length [6]
  if (_.isEmpty(name)) {
    _.set(error, "name", "Name is required");
  } else if (name.length < 6) {
    _.set(error, "name", "Name needs to be 6 characters or more");
  }

  // Email Validation
  // 1. Required
  // 2. Min Length [6]
  // 3. Is Valid
  if (_.isEmpty(email)) {
    _.set(error, "email", "Email is required");
  } else if (email.length < 6) {
    _.set(error, "email", "Email needs to be 6 characters or more");
  } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    _.set(error, "email", "Email is invalid");
  }

  // Password Validation
  // 1. Required
  // 2. Min Length [6]
  if (_.isEmpty(password)) {
    _.set(error, "password", "Password is required");
  } else if (password.length < 6) {
    _.set(error, "password", "Password needs to be 6 characters or more");
  }

  // Confirm Password Validation
  // 1. Required
  // 2. Match with password
  if (_.isEmpty(confirmPassword)) {
    _.set(error, "confirmPassword", "Please re-type your password");
  } else if (password !== confirmPassword) {
    _.set(error, "confirmPassword", "Passwords do not match");
  }

  return error;
}

export function messageValidation({ message }) {
  let error = {};

  // Message Validation
  // 1. Required
  // 2. Max length 1000 characters
  if (_.isEmpty(message)) {
    _.set(error, "message", "Message is required");
  } else if (message.length > 1000) {
    _.set(error, "message", "Message must be less than 1000 characters");
  }

  return error;
}
