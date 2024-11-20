const AWS = require('aws-sdk');
const config = require('../../config/config');
const multer = require('multer');

const configS3 = () => {
  AWS.config.update({
    accessKeyId: config.bucket.AWS_S3_KEY,
    secretAccessKey: config.bucket.AWS_S3_SECRET,
    region: config.bucket.AWS_S3_REGION,
  });
};

let myBucket = config.bucket.AWS_S3_BUCKET_NAME;
const s3 = new AWS.S3();

var storage = multer.memoryStorage();

const uploadDirect = multer({ storage: storage });
const uploadDirectFileS3 = async function (key, folderName, data, fileExtension) {
  let myBucket = config.bucket.AWS_S3_BUCKET_NAME;
  // return async (resolve, reject) => {
  params = {
    Bucket: myBucket + '/' + folderName,
    Key: key,
    Body: data,
    ContentType: fileExtension,
    ACL: 'public-read',
  };
  const result = await s3.upload(params, {}).promise();
  return result;
};

module.exports = { uploadDirect, uploadDirectFileS3, configS3 };
