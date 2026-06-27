import { body, param } from 'express-validator';

export const createSessionValidator = [
  body('sessionName')
    .trim()
    .notEmpty()
    .withMessage('Session name is required')
    .isLength({ max: 100 })
    .withMessage('Session name cannot exceed 100 characters'),
    
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject name is required'),
    
  body('expiryMinutes')
    .optional()
    .isInt({ min: 2, max: 120 })
    .withMessage('Session expiry must be between 2 and 120 minutes')
];

export const mongoIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid MongoDB unique Identifier format')
];
