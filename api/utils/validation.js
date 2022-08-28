const Joi = require("joi");

const registrationValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

const messageValidation = (data) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    sender: Joi.string().allow(null, ""),
    message: Joi.string().min(1).required(),
  });

  return schema.validate(data);
};

module.exports = { registrationValidation, loginValidation, messageValidation };
