const { body, validationResult } = require('express-validator');
const messages = require('../../config/messages.json');

// Middleware for validating login request
exports.validatelogin = [

  //email_address must exist and be a valid email format
  body('email_address')
    .exists().withMessage('Email address is required') 
    .isEmail().withMessage('Please enter a valid email'), 

  //password must exist, be at least 7 characters long, and meet complexity requirements
  body('password')
    .exists().withMessage('Password is required') 
    .isLength({ min: 7 }).withMessage('Password must be at least 7 characters long') // Ensure password length is at least 7 characters
    .matches(/^(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*\d)/) // Ensure password has at least one uppercase letter, one alphanumeric character, and one digit
    .withMessage('Password must contain at least one uppercase letter, one alphanumeric character, and one digit'),

  // Middleware function to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req); 
    const existsErrors = errors.array().filter(err => err.msg.includes('is required')); // Filter errors related to missing required fields

    // If there are missing required field errors, respond with a 400 error and list the missing fields
    if (existsErrors.length > 0) {
      const errorMessages = existsErrors.map(err => err.msg); // Extract error messages for required fields
      return res.status(400).json({
        success: false,
        errors: errorMessages
      });
    }

    // Filter errors related to incorrect formats (e.g., invalid email or password format)
    const formatErrors = errors.array().filter(err => !err.msg.includes('is required'));
    
    // If there are format validation errors, respond with a 400 error and list the format issues
    if (formatErrors.length > 0) {
      const formatErrorMessages = formatErrors.map(err => err.msg); // Extract error messages for format issues
      return res.status(400).json({
        success: false,
        errors: formatErrorMessages
      });
    }

    next(); // Proceed to the next middleware or controller if validation passes
  },
];
