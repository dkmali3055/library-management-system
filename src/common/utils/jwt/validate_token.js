const jwt = require('jsonwebtoken');

exports.validate_token = async (token, secret) => {
  try {
    // taking token from header
    let jwtToken = token;
    if (jwtToken.includes('Bearer')) {
      jwtToken = jwtToken.split(' ')[1];
    }

    // verifying it
    const data = jwt.verify(jwtToken, secret);

    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};
