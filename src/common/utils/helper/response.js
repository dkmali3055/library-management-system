const { logger_methods } = require('../logger/logger_methods');


module.exports.response = (statusCode, message = "", data, status= true, req, res) => {
  logger_methods[statusCode](
    message,
    statusCode,
    req.id,
    req.originalUrl,
    req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.connection.remoteAddress || null
  );
  return res.status(statusCode).json({
    status: status,
    statusCode: statusCode,
    message: message,
    data: data
  });
};
