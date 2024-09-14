const { body, validationResult } = require('express-validator');
const messages = require('../../config/messages.json');

exports.validateAddProduct = [
  body('name')
    .exists().withMessage(messages.nameRequired),

  body('category')
    .exists().withMessage(messages.categoryRequired),

  body('description')
    .exists().withMessage(messages.descriptionRequired),

  body('price')
    .exists().withMessage(messages.priceRequired)
    .isFloat({ min: 0 }).withMessage(messages.invalidPrice), // Use isFloat for numeric validation

  body('discount')
    .exists().withMessage(messages.discountRequired)
    .isFloat({ min: 0, max: 100 }).withMessage(messages.invalidDiscount), // Use isFloat for range validation

  (req, res, next) => {
    const errors = validationResult(req);
    
    // Separate required field errors
    const requiredErrors = errors.array().filter(err => err.msg.includes('is required'));
    if (requiredErrors.length > 0) {
      const errorMessages = requiredErrors.map(err => err.msg);
      return res.status(400).json({
        success: false,
        errors: errorMessages
      });
    }

    // Separate format validation errors
    const formatErrors = errors.array().filter(err => !err.msg.includes('is required'));
    if (formatErrors.length > 0) {
      const formatErrorMessages = formatErrors.map(err => err.msg);
      return res.status(400).json({
        success: false,
        errors: formatErrorMessages
      });
    }

    next();
  },
];
