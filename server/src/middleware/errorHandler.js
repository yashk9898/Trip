const multer = require('multer');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Multer errors
  if (err instanceof multer.MulterError) {
    statusCode = 400;
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'File too large. Maximum size is 15MB.';
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'Too many files. Maximum is 10 files per upload.';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = err.message || 'Unexpected file type.';
        break;
      default:
        message = 'File upload error.';
    }
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  let status = err.status || 'error';

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your token has expired! Please log in again.';
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
    res.status(statusCode).json({
      success: false,
      status,
      message,
      error: err,
      stack: err.stack,
    });
  } else {
    // Production
    if (err.isOperational || statusCode !== 500) {
      res.status(statusCode).json({
        success: false,
        status,
        message,
      });
    } else {
      // Programming or other unknown error: don't leak error details
      console.error('💥 ERROR 💥', err);
      res.status(500).json({
        success: false,
        status: 'error',
        message: 'Something went very wrong!',
      });
    }
  }
};

module.exports = errorHandler;
