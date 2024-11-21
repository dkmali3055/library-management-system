const httpStatus = require('http-status');
const bookService = require('../service/books.service');
const bookBorrowService = require('../service/books.borrow.service');
const ApiError = require('../../../common/utils/ApiError');
const catchAsync = require('../../../common/utils/catchAsync');
const { message } = require('../../../common/utils/message');
const { response } = require('../../../common/utils/helper/response');
const { bookAction } = require('../constant/book.borrow.constant');
const { roles } = require('../../../common/config/roles');
const { broadcastEvent } = require('../../../socket/manager');
const { events } = require('../../../socket/constant');

const addBookBorrow = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const bookId = req.params.bookId;
  const existBooks = await bookService.findOneBook({ _id: bookId });
  if (!existBooks) {
    throw new ApiError(httpStatus.NOT_FOUND, message.book.NOT_FOUND);
  }
  if (existBooks.stock <= 0) {
    throw new ApiError(httpStatus.NOT_FOUND, message.bookBorrowReturn.OUT_OF_STOCK);
  }
  existBooks.stock = existBooks.stock - 1;
  await existBooks.save();
  const bookBorrow = await bookBorrowService.addBookBorrow({ userId, bookId, type: bookAction.borrow });
  broadcastEvent(events.borrow, { message: message.bookBorrowReturn.borrowed, data: { book: existBooks, user: req.user } }); // broadcast event
  return response(httpStatus.OK, message.bookBorrowReturn.borrowed, { bookBorrow }, true, req, res);
});

const addBookReturn = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const borrowId = req.params.borrowId;
  const existRecord = await bookBorrowService.findOneBorrowHistory({ _id: borrowId });
  if (!existRecord && existRecord.type !== bookAction.borrow) {
    throw new ApiError(httpStatus.BAD_REQUEST, message.bookBorrowReturn.NO_BOOK_FOUND_FOR_RETURN);
  }
  if (existRecord.isReturned) {
    throw new ApiError(httpStatus.BAD_REQUEST, message.bookBorrowReturn.alreadyReturned);
  }
  let bookId = existRecord.bookId;
  const existBooks = await bookService.findOneBook({ _id: bookId });
  if (!existBooks) {
    throw new ApiError(httpStatus.NOT_FOUND, message.book.NOT_FOUND);
  }

  existBooks.stock = existBooks.stock + 1;
  await existBooks.save();
  existRecord.isReturned = true;
  await existRecord.save();
  const bookBorrow = await bookBorrowService.addBookBorrow({ userId, bookId, type: bookAction.return });
  broadcastEvent(events.return, { message: message.bookBorrowReturn.returned, data: { book: existBooks, user: req.user } }); // broadcast event
  return response(httpStatus.OK, message.bookBorrowReturn.returned, { bookBorrow }, true, req, res);
});

const getAllBookHistory = catchAsync(async (req, res) => {
  const { search, page, limit, type } = req.query;
  let options = {
    search,
    page,
    limit,
    type,
  };
  if (req.user.role == roles.user) {
    options.userId = req.user._id;
  }
  const books = await bookBorrowService.getAllBookBorrowByFilter(options);
  let result = {};
  if (books.length) {
    result.books = books[0].list;
    result.count = books[0].total.length && books[0].total[0].totalCount ? books[0].total[0].totalCount : 0;
  }
  return response(httpStatus.OK, '', { result }, true, req, res);
});
module.exports = { getAllBookHistory, addBookReturn, addBookBorrow };
