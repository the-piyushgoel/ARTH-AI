// ============================================================
// ARTH Backend — Request Validation Middleware
// Generic validation middleware that checks request body
// against a simple schema definition.
// ============================================================

const ApiError = require('../utils/ApiError');

/**
 * Creates a validation middleware for the given required fields.
 * @param {string[]} requiredFields - Array of required field names
 * @returns {Function} Express middleware
 *
 * Usage:
 *   router.post('/path', validateRequest(['email', 'password']), controller);
 */
const validateRequest = (requiredFields) => {
  return (req, _res, next) => {
    const missingFields = [];

    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return next(
        ApiError.badRequest(`Missing required fields: ${missingFields.join(', ')}`)
      );
    }

    next();
  };
};

module.exports = validateRequest;
