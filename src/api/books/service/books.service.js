const config = require('../../../common/config/config');
const Books = require('../model/books.model');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const findOneBook = async (options) => {
  return await Books.findOne(options);
};
const addBook = async (body) => {
  const newBook = new Books(body);
  return await newBook.save();
};
const updateBook = async (filter, body) => {
  const newBook = await Books.updateOne(filter, body);
  return newBook;
};
const getAllBookByFilter = async (options) => {
  let filter = {};
  if (options.search) {
    const reg = new RegExp(options.search, 'i');
    filter.$or = [{ title: reg }, { author: reg }, { genre: reg }];
  }

  let aggregateArray = [{ $sort: { createdAt: -1 } }];
  if (options.page && options.limit) {
    aggregateArray.push({
      $skip: (options.page - 1) * options.limit,
    });
    aggregateArray.push({
      $limit: options.limit,
    });
  }
  const list = await Books.aggregate([
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

module.exports = { findOneBook, getAllBookByFilter, addBook, updateBook };
