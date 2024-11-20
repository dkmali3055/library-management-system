const express = require('express');
const userRoute = require('./user.route');
const booksRoute = require('./book.route');
const uploadRoute = require('./upload.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/books',
    route: booksRoute,
  },
  {
    path: '/upload',
    route: uploadRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
