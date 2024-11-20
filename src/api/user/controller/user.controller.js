const httpStatus = require('http-status');
const userService = require('../service/user.service');
const ApiError = require('../../../common/utils/ApiError');
const { message } = require('../../../common/utils/message');
const tokenModule = require('../../token');
const catchAsync = require('../../../common/utils/catchAsync');
const { response } = require('../../../common/utils/helper/response');
const login = catchAsync(async (req, res) => {
  let { email, password } = req.body;
  let user = await userService.findOneUser({ email: email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, message.user.NOT_FOUND);
  }
  if (user.password !== password) {
    throw new ApiError(httpStatus.UNAUTHORIZED, message.user.PASSWORD_INCORRECT);
  }
  const payload = {
    _id: user._id,
    role: user.role,
    email: user.email,
    username: user.username,
  };
  const tokens = await tokenModule.tokenService.generateTokens(payload);
  const data = {
    user,
    tokens,
  };
  return response(httpStatus.OK, message.user.LOG_IN, data, true, req, res);
});

module.exports = { login };
