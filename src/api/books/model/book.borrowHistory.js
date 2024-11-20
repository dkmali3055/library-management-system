const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../../../common/config/config');
const { bookAction } = require('../constant/book.borrow.constant');

const booksBorrowSchema = new Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: config.collections.books,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: config.collections.books,
    },
    type: {
      type: String,
      enum: bookAction.values,
    },
    isReturned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const BooksBorrow = mongoose.model(config.collections.bookBorrow, booksBorrowSchema);

module.exports = BooksBorrow;
