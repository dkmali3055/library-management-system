const ApiError = require('../../../common/utils/ApiError');
const s3Upload = require('../../../common/utils/aws/upload');
const catchAsync = require('../../../common/utils/catchAsync');
const { response } = require('../../../common/utils/helper/response');
const httpStatus = require('http-status');
const multiUpload = catchAsync(async (req, res) => {
  if (!req.files) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'upload.notFound');
  }

  let files = req.files;
  let responseData = [];
  for (let index = 0; index < files.length; index++) {
    const element = files[index];
    const dateString = Date.now();
    const regex = /[^a-zA-Z0-9.]/g;
    const Key = dateString + '_' + element.originalname.replace(regex, '_');
    try {
      let _res = await s3Upload.uploadDirectFileS3(Key, 'test-sample', element.buffer, element.mimetype);
      responseData[index] = {
        url: _res.Location,
        key: _res.Key,
      };
    } catch (Ex) {
      responseData[index] = Ex.message;
      throw new ApiError(httpStatus.BAD_REQUEST, Ex.message);
    }
  }

  return response(httpStatus.OK, 'upload.uploaded', { data: responseData }, true, req, res);
});

module.exports = { multiUpload };
