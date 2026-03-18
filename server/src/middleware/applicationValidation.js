const { body } = require('express-validator');

const validateApplication = [
  body('job_id')
    .notEmpty().withMessage('Job ID is required.')
    .isInt({ min: 1 }).withMessage('Job ID must be a valid number.'),

  body('cover_letter')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Cover letter must be under 2000 characters.'),
];

module.exports = { validateApplication };