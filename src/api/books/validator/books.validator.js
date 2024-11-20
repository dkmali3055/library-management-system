const Joi = require('joi');
const { bookAction } = require('../constant/book.borrow.constant');

const addBookValidator = {
  body: Joi.object().keys({
    title: Joi.string().required().label('Book title'),
    author: Joi.string().required().label('Book author'),
    genre: Joi.required().label('Book genre').allow(''),
    stock: Joi.number().integer().min(1).required().label('Book stock'),
    coverImage: Joi.string().required().label('Book cover image'),
  }),
};

const getAllBookValidator = {
  query: Joi.object().keys({
    search: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
const getAllBookBorrowValidator = {
  query: Joi.object().keys({
    search: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    type: Joi.string().valid(bookAction.borrow, bookAction.return),
  }),
};
const BookBorrowValidator = {
  params: Joi.object().keys({
    bookId: Joi.string().required().label('Book ID'),
  }),
};
const BookReturnValidator = {
  params: Joi.object().keys({
    borrowId: Joi.string().required().label('Book ID'),
  }),
};

module.exports = {
  addBookValidator,
  getAllBookValidator,
  getAllBookBorrowValidator,
  BookBorrowValidator,
  BookReturnValidator,
};
