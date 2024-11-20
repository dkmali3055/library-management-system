const config = require('../../../common/config/config');
const { create_jwt_token } = require('../../../common/utils/jwt/create_token');
const { validate_token } = require('../../../common/utils/jwt/validate_token');
const Token = require('../model/token.model');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
exports.generateTokens = async (payload, role) => {
  const accessToken = await create_jwt_token(config.jwt.secret, config.jwt.accessExpirationMinutes + 'm', payload);

  await Token.findOneAndDelete({ userId: payload._id });

  let tokenData = await new Token({ userId: payload._id, accessToken: accessToken }).save();
  return { accessToken };
};

exports.isValidRefreshToken = async (refreshToken) => {
  let payload;
  try {
    payload = await validate_token(refreshToken, JWTRefreshSecret);
  } catch (err) {
    return false;
  }

  const token = await Token.findOne({ refreshToken: refreshToken });
  if (!token) return false;
  if (token.expiry < Date.now()) {
    await Token.deleteOne({ _id: token._id });
    return false;
  }

  let newPayload = { id: payload.id, role: payload.role };
  const accessToken = await create_jwt_token(config.jwt.secret, config.jwt.accessExpirationMinutes + 'm', newPayload);
  token.accessToken = accessToken;
  await token.save();
  return accessToken;
};

exports.findByUserId = async (id) => {
  return await Token.findOne({ userId: new ObjectId(id) });
};

exports.deleteToken = async (body) => {
  return await Token.deleteOne(body);
};
