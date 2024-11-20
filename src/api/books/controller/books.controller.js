const httpStatus = require('http-status');
const bookService = require('../service/books.service');
const ApiError = require('../../../common/utils/ApiError');
const catchAsync = require('../../../common/utils/catchAsync');
const { message } = require('../../../common/utils/message');
const { response } = require('../../../common/utils/helper/response');

const addBook = catchAsync(async (req, res) => {
  const { title, author, genre, stock, coverImage } = req.body;
  const existBooks = await bookService.findOneBook({ title, author });
  if (existBooks) {
    throw new ApiError(httpStatus.BAD_REQUEST, message.book.EXIST);
  }
  let book = await bookService.addBook({ title, author, genre, stock, coverImage });
  return response(httpStatus.CREATED, message.book.CREATED, { book }, true, req, res);
});

const getAllBook = catchAsync(async (req, res) => {
  const { search, page, limit } = req.query;
  const books = await bookService.getAllBookByFilter({ search, page, limit });
  let result = {};
  if (books.length) {
    result.books = books[0].list;
    result.count = books[0].total.length && books[0].total[0].totalCount ? books[0].total[0].totalCount : 0;
  }
  return response(httpStatus.OK, '', { result }, true, req, res);
});
module.exports = { addBook, getAllBook };
