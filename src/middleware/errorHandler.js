const ApiResponse = require('../utils/responseFormatter');
const logger = require('../utils/logger');
const { ERROR_TYPES } = require('../utils/constants');

class ApiError extends Error {
  constructor(message, statusCode = 500, errorType = ERROR_TYPES.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.errorType = errorType;
  }
}

const errorHandler = (err, req, res, next) => {
  const context = {
    requestId: req.requestId,
    path: req.path,
    method: req.method,
  };

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errorType = err.errorType || ERROR_TYPES.INTERNAL_SERVER_ERROR;
  let errors = null;

  // Log error
  logger.error(`${statusCode} - ${message}`, {
    ...context,
    error: err,
    stack: err.stack,
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 422;
    errorType = ERROR_TYPES.VALIDATION_ERROR;
    errors = err.details || null;
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid request data';
    errorType = ERROR_TYPES.VALIDATION_ERROR;
  }

  if (err.name === 'MongoError' && err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value';
    errorType = 'DUPLICATE_ERROR';
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    errorType = ERROR_TYPES.AUTHENTICATION_ERROR;
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    errorType = ERROR_TYPES.AUTHENTICATION_ERROR;
  }

  // Send error response
  res.status(statusCode).json(
    ApiResponse.error(message, statusCode, errorType, errors)
  );
};

// Wrapper for async route handlers
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 404 handler
const notFoundHandler = (req, res) => {
  res.status(404).json(
    ApiResponse.notFound(`Route ${req.method} ${req.path} not found`)
  );
};

module.exports = {
  ApiError,
  errorHandler,
  asyncHandler,
  notFoundHandler,
};
