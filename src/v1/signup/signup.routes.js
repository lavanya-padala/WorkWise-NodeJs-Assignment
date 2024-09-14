const express = require('express');
const router = express.Router();
const signupController = require('./signup.controller');
const signupValidation= require('./signup.validation');

//route for signup with validation middleware and logincontroller
router.post('/signup',signupValidation.validatesignup,signupController.signup);

module.exports = router;
