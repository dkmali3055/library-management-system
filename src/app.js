const express = require('express');
const cors = require('cors');
const httpStatus = require('http-status');
const config = require('./common/config/config');
const morgan = require('./common/config/morgan');
const { authLimiter } = require('./common/middlewares/rateLimiter');
const api = require('./routes/api');
const { errorConverter, errorHandler } = require('./common/middlewares/error');
const ApiError = require('./common/utils/ApiError');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}


// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));



// enable cors
app.use(cors());
app.options('*', cors());


// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/api', api);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
