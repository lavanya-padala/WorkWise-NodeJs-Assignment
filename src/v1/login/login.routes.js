const express = require('express');
const router = express.Router();
const loginController = require('./login.controller');
const loginValidation = require('./login.validation');

//route for login with validation middleware and logincontroller
router.post('/login', loginValidation.validatelogin, loginController.login);

module.exports = router;
