import { body } from 'express-validator';
import { ROLES } from '../constants/index.js';

export const registerValidator = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ max: 100 })
    .withMessage('Full name cannot exceed 100 characters'),
    
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
    
  body('role')
    .trim()
    .notEmpty()
    .withMessage('User role is required')
    .isIn(Object.values(ROLES))
    .withMessage(`Role must be one of: ${Object.values(ROLES).join(', ')}`),
    
  body('department')
    .trim()
    .notEmpty()
    .withMessage('Department is required'),
    
  // Dynamic validation for Student fields
  body('course')
    .if(body('role').equals(ROLES.STUDENT))
    .trim()
    .notEmpty()
    .withMessage('Course is required for Student role'),
    
  body('semester')
    .if(body('role').equals(ROLES.STUDENT))
    .notEmpty()
    .withMessage('Semester is required for Student role')
    .isInt({ min: 1, max: 12 })
    .withMessage('Semester must be an integer between 1 and 12'),
    
  body('studentId')
    .if(body('role').equals(ROLES.STUDENT))
    .trim()
    .notEmpty()
    .withMessage('Student ID is required for Student role'),
    
  // Dynamic validation for staff/teacher fields
  body('employeeId')
    .if(body('role').isIn([ROLES.ADMIN, ROLES.TEACHER, ROLES.EMPLOYEE]))
    .trim()
    .notEmpty()
    .withMessage('Employee ID is required for Admin, Teacher, and Employee roles')
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const profileUpdateValidator = [
  body('fullName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Full name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Full name cannot exceed 100 characters'),

  body('department')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Department cannot be empty'),

  body('course')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Course cannot be empty'),

  body('semester')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Semester must be an integer between 1 and 12')
];
