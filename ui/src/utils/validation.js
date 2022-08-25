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
