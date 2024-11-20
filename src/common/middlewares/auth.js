const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roles } = require('../../common/config/roles');
const { validate_token } = require('../utils/jwt/validate_token');
const config = require('../config/config');
const logger = require('../config/logger');
const { tokenService } = require('../../api/token');

const verifyToken = async (payload, token) => {
  const _token = await tokenService.findByUserId(payload._id);

  if (!_token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }
  if (_token.expiry < Date.now()) {
    await tokenService.deleteToken({ _id: _token._id });
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }
  if (_token.accessToken !== token) {
    await tokenService.deleteToken({ _id: _token._id });
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }
};

const auth =
  (allowedRoleArray = []) =>
  async (req, res, next) => {
    let token = req.headers.authorization;

    try {
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
      }
      if (token.includes('Bearer')) {
        token = token.split(' ')[1];
      }
      let payload = await validate_token(token, config.jwt.secret);
      if (allowedRoleArray.length && !allowedRoleArray.includes(payload.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }
      if (payload.role == roles.admin) {
        await verifyToken(payload, token);
        req.user = payload;
        req.role = payload.role;
        next();
      } else if (payload.role == roles.user) {
        await verifyToken(payload, token);
        req.user = payload;
        req.role = payload.role;
        next();
      } else {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
      }
    } catch (ex) {
      logger.error(ex.message);
      next(ex);
    }
  };

module.exports = auth;
