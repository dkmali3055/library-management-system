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
  let aggregateArray = [
    { $sort: { createdAt: -1 } },
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
        let: { userId: '$userId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ['$_id', '$$userId'] }],
              },
            },
          },
          {
            $project: {
              password: 0,
              role: 0,
            },
          },
        ],
        as: 'user',
      },
    },
    {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  // Build a $match stage for filtering
  const matchFilter = {};
  if (options.search) {
    const reg = new RegExp(options.search, 'i');
    matchFilter.$or = [{ 'book.title': reg }, { 'user.username': reg }];
  }

  if (options.type) {
    matchFilter.type = options.type;
  }

  if (options.userId) {
    matchFilter.userId = new ObjectId(options.userId);
  }

  if (Object.keys(matchFilter).length > 0) {
    aggregateArray.push({
      $match: matchFilter,
    });
  }

  // Pagination logic
  const paginationStages = [];
  if (options.page && options.limit) {
    paginationStages.push({
      $skip: (options.page - 1) * options.limit,
    });
    paginationStages.push({
      $limit: options.limit,
    });
  }

  // Main aggregation
  const list = await BooksBorrow.aggregate([
    ...aggregateArray,
    {
      $facet: {
        total: [{ $count: 'totalCount' }],
        list: [...paginationStages],
      },
    },
  ]);

  return list;
};

module.exports = { findOneBorrowHistory, addBookBorrow, getAllBookBorrowByFilter };
