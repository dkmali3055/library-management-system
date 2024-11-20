const config = require('../../../common/config/config');
const BooksBorrow = require('../model/book.borrowHistory');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const findOneBorrowHistory = async (options) => {
  return await BooksBorrow.findOne(options);
};
const addBookBorrow = async (body) => {
  const newBook = new BooksBorrow(body);
  return await newBook.save();
};

const getAllBookBorrowByFilter = async (options) => {
  let filter = {};
  let aggregateArray = [{ $sort: { createdAt: -1 } }];
  aggregateArray.push(
    {
      $lookup: {
        from: config.collections.books,
        localField: 'bookId',
        foreignField: '_id',
        as: 'book',
      },
    },
    {
      $unwind: {
        path: '$book',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: config.collections.users,
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: true,
      },
    }
  );
  if (options.type) {
    filter.type = options.type;
  }
  if (options.search) {
    const reg = new RegExp(options.search, 'i');
    filter.$or = [{ 'book.title': reg }, { 'user.username': reg }];
  }
  aggregateArray.push({
    $match: filter,
  });
  if (options.page && options.limit) {
    aggregateArray.push({
      $skip: (options.page - 1) * options.limit,
    });
    aggregateArray.push({
      $limit: options.limit,
    });
  }
  const list = await BooksBorrow.aggregate([
    {
      $match: filter,
    },
    {
      $facet: {
        total: [{ $count: 'totalCount' }],
        list: aggregateArray,
      },
    },
  ]);
  return list;
};

module.exports = { findOneBorrowHistory, addBookBorrow, getAllBookBorrowByFilter };
