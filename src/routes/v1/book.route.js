const express = require('express');
const validate = require('../../common/middlewares/validate');
const { booksController, booksValidator, booksBorrowController } = require('../../api/books');
const auth = require('../../common/middlewares/auth');
const { roles } = require('../../common/config/roles');
const router = express.Router();

router.post('/', auth([roles.admin]), validate(booksValidator.addBookValidator), booksController.addBook);
router.get('/', auth([]), validate(booksValidator.getAllBookValidator), booksController.getAllBook);
router.post(
  '/borrow/:bookId',
  auth([roles.user]),
  validate(booksValidator.BookBorrowValidator),
  booksBorrowController.addBookBorrow
);
router.post(
  '/return/:borrowId',
  auth([roles.user]),
  validate(booksValidator.BookReturnValidator),
  booksBorrowController.addBookReturn
);
router.get(
  '/borrow-history',
  auth([]),
  validate(booksValidator.getAllBookBorrowValidator),
  booksBorrowController.getAllBookHistory
);
module.exports = router;
