const { body, validationResult } = require('express-validator');
const messages = require('../../config/messages.json');

exports.validatesignup = [
  //email must exist and be a valid email format
  body('email_address')
    .exists().withMessage('Email address is required')
    .isEmail().withMessage('Please enter a valid email'),
    
  //number must exist and be a valid 10-digit number
  body('contact_number')
    .exists().withMessage('Contact number is required')
    .matches(/^\d{10}$/).withMessage('Please enter a valid 10-digit contact number'),
    
  //password must exist, be at least 7 characters long, and meet complexity requirements
  body('password')
    .exists().withMessage('Password is required')
    .isLength({ min: 7 }).withMessage('Password must be at least 7 characters long')
    .matches(/^(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one alphanumeric character, and one digit'),
    
  //role must exist and be either 'seller' or 'buyer'
  body('role')
    .exists().withMessage('Role is required')
    .isIn(['seller', 'buyer']).withMessage('Role must be either seller or buyer'),

  // Middleware function to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);

    // Check for missing required fields (errors like "is required")
    const existsErrors = errors.array().filter(err => err.msg.includes('is required'));
    if (existsErrors.length > 0) {
      const errorMessages = existsErrors.map(err => err.msg);
      return res.status(400).json({
        success: false,
        errors: errorMessages
      });
    } 

    // Check for formatting errors (errors not related to missing fields)
    const formatErrors = errors.array().filter(err => !err.msg.includes('is required'));
    if (formatErrors.length > 0) {
      const formatErrorMessages = formatErrors.map(err => err.msg);
      return res.status(400).json({
        success: false,
        errors: formatErrorMessages
      });
    }

    next(); // Proceed
  },
];
