const Joi = require('joi');

const loginUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email().label('Email'),
    password: Joi.string().required().label('password'),
  }),
};

module.exports = {
  loginUser,
};
