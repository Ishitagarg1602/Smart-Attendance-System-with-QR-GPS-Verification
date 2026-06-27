import AppError from '../utils/appError.js';
import { HTTP_STATUS } from '../constants/index.js';

const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user is mounted by the protect middleware
    if (!req.user) {
      return next(new AppError('Authentication context missing.', HTTP_STATUS.UNAUTHORIZED));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', HTTP_STATUS.FORBIDDEN)
      );
    }

    next();
  };
};

export default restrictTo;
