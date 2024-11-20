const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../../.env') });

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  url: process.env.URL,
  mongoose: {
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
    DB_SERVER: process.env.DB_SERVER,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    url: process.env.MONGODB_URL + (process.env.NODE_ENV === 'test' ? '-test' : ''),
    options: {},
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  collections: {
    users: 'users',
    authToken: 'tokens',
    books: 'books',
    bookBorrow: 'bookborrows',
  },
  bucket: {
    AWS_S3_KEY: process.env.BUCKET_KEY,
    AWS_S3_SECRET: process.env.BUCKET_SECRET,
    AWS_S3_REGION: process.env.BUCKET_REGION,
    AWS_S3_BUCKET_NAME: process.env.BUCKET_NAME,
    AWS_S3_URL: process.env.BUCKET_URL,
  },
};
