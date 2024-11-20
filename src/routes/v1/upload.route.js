const express = require('express');
const s3Upload = require('../../common/utils/aws/upload');
const auth = require('../../common/middlewares/auth');
const { uploadController } = require('../../api/upload');

const router = express.Router();

router.post('/upload-book-cover', s3Upload.uploadDirect.array('files'), uploadController.multiUpload);

module.exports = router;
