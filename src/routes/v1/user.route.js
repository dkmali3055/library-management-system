const express = require('express');
const validate = require('../../common/middlewares/validate');
const { userController, userValidator } = require('../../api/user');
const router = express.Router();

router.post('/login', validate(userValidator.loginUser), userController.login);

module.exports = router;
