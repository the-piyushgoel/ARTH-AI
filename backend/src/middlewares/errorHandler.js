// ============================================================
// ARTH Backend — Global Error Handler Middleware
// Catches all errors and returns structured JSON responses.
// Distinguishes between operational errors (ApiError) and
// unexpected errors for clean debugging.
// ============================================================

const logger = require('../utils/logger');

const errorHandler = (err, req, res, _next) => {
  // Log the full error for debugging
  logger.error(`${err.type || 'ERROR'}: ${err.message}`, {
    path: req.path,
    method: req.method,
    stack: err.stack,
  });

  // Determine status code
  const statusCode = err.statusCode || 500;

  // Build structured error response
  const response = {
    success: false,
    error: err.message || 'Internal server error',
    type: err.type || 'SERVER',
  };

  // Include stack trace only in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
