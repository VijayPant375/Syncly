const { body } = require('express-validator');

const validateJob = [
  body('title')
    .trim()
    .notEmpty().withMessage('Job title is required.')
    .isLength({ max: 150 }).withMessage('Title must be under 150 characters.'),

  body('company')
    .trim()
    .notEmpty().withMessage('Company name is required.')
    .isLength({ max: 100 }).withMessage('Company must be under 100 characters.'),

  body('location')
    .trim()
    .notEmpty().withMessage('Location is required.'),

  body('type')
    .trim()
    .notEmpty().withMessage('Job type is required.')
    .isIn(['full-time', 'part-time', 'contract', 'internship'])
    .withMessage('Type must be full-time, part-time, contract or internship.'),

  body('description')
    .trim()
    .notEmpty().withMessage('Job description is required.'),

  body('salary')
    .optional()
    .trim(),
];

module.exports = { validateJob };