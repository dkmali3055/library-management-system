const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { roles } = require('../../../common/config/roles');
const config = require('../../../common/config/config');

const userSchema = new Schema(
  {
    email: {
      type: String,
      index: true,
    },
    username: {
      type: String,
      index: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: roles.values(),
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model(config.collections.users, userSchema);

module.exports = User;
