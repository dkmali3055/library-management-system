const config = require('../../../common/config/config');
const User = require('../model/user.model');

async function findUserById(id) {
  return await User.findById(id);
}

async function findOneUser(query) {
  return await User.findOne(query);
}
module.exports = { findUserById, findOneUser };
