import logger from '../config/logger.js';
import { HTTP_STATUS } from '../constants/index.js';

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return { message, statusCode: HTTP_STATUS.BAD_REQUEST };
};

const handleDuplicateFieldsDB = (err) => {
  // Extract duplicate value using regex or object keys
  const value = Object.values(err.keyValue || {})[0] || '';
  const message = `Duplicate value: '${value}'. Please use another value!`;
  return { message, statusCode: HTTP_STATUS.CONFLICT };
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return { message, statusCode: HTTP_STATUS.BAD_REQUEST };
};

const handleJWTError = () => ({
  message: 'Invalid token. Please log in again!',
  statusCode: HTTP_STATUS.UNAUTHORIZED
});

const handleJWTExpiredError = () => ({
  message: 'Your token has expired! Please log in again.',
  statusCode: HTTP_STATUS.UNAUTHORIZED
});

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: err.stack,
    error: err
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  } else {
    // Programming or other unknown error: don't leak details
    logger.error('ERROR 💥', err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong on the server!'
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  err.status = err.status || 'error';

  logger.error(`API Error: ${err.message} at ${req.originalUrl}`);

  if (process.env.NODE_ENV === 'development') {
    let errorObj = { ...err };
    errorObj.message = err.message;
    errorObj.stack = err.stack;

    if (err.name === 'CastError') {
      const dbErr = handleCastErrorDB(err);
      errorObj.message = dbErr.message;
      errorObj.statusCode = dbErr.statusCode;
      errorObj.isOperational = true;
    }
    if (err.code === 11000) {
      const dbErr = handleDuplicateFieldsDB(err);
      errorObj.message = dbErr.message;
      errorObj.statusCode = dbErr.statusCode;
      errorObj.isOperational = true;
    }
    if (err.name === 'ValidationError') {
      const dbErr = handleValidationErrorDB(err);
      errorObj.message = dbErr.message;
      errorObj.statusCode = dbErr.statusCode;
      errorObj.isOperational = true;
    }
    if (err.name === 'JsonWebTokenError') {
      const jwtErr = handleJWTError();
      errorObj.message = jwtErr.message;
      errorObj.statusCode = jwtErr.statusCode;
      errorObj.isOperational = true;
    }
    if (err.name === 'TokenExpiredError') {
      const jwtErr = handleJWTExpiredError();
      errorObj.message = jwtErr.message;
      errorObj.statusCode = jwtErr.statusCode;
      errorObj.isOperational = true;
    }

    sendErrorDev(errorObj, res);
  } else {
    let errorObj = { ...err };
    errorObj.message = err.message;

    if (err.name === 'CastError') {
      const dbErr = handleCastErrorDB(err);
      errorObj.message = dbErr.message;
      errorObj.statusCode = dbErr.statusCode;
      errorObj.isOperational = true;
    }
    if (err.code === 11000) {
      const dbErr = handleDuplicateFieldsDB(err);
      errorObj.message = dbErr.message;
      errorObj.statusCode = dbErr.statusCode;
      errorObj.isOperational = true;
    }
    if (err.name === 'ValidationError') {
      const dbErr = handleValidationErrorDB(err);
      errorObj.message = dbErr.message;
      errorObj.statusCode = dbErr.statusCode;
      errorObj.isOperational = true;
    }
    if (err.name === 'JsonWebTokenError') {
      const jwtErr = handleJWTError();
      errorObj.message = jwtErr.message;
      errorObj.statusCode = jwtErr.statusCode;
      errorObj.isOperational = true;
    }
    if (err.name === 'TokenExpiredError') {
      const jwtErr = handleJWTExpiredError();
      errorObj.message = jwtErr.message;
      errorObj.statusCode = jwtErr.statusCode;
      errorObj.isOperational = true;
    }

    sendErrorProd(errorObj, res);
  }
};

export default globalErrorHandler;
