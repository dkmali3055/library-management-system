const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../../../common/config/config');

const booksSchema = new Schema(
  {
    title: {
      type: String,
    },
    author: {
      type: String,
    },
    genre: {
      type: String,
    },
    stock: {
      type: Number,
    },
    coverImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Books = mongoose.model(config.collections.books, booksSchema);

module.exports = Books;
