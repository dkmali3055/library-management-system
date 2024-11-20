var jwt = require('jsonwebtoken');

exports.create_jwt_token = async (secret, time, payload) => {
  try {
    var accessToken = jwt.sign(payload, secret, { expiresIn: time });
    return Promise.resolve(accessToken);
  } catch (error) {
    return Promise.reject(error);
  }
};
