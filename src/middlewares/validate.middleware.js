import { validationResult } from 'express-validator';
import { HTTP_STATUS } from '../constants/index.js';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Formatted array of errors
    const errorMsg = errors.array().map(err => `${err.path}: ${err.msg}`).join(', ');
    
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: `Validation Error: ${errorMsg}`
    });
  }
  next();
};

export default validate;
