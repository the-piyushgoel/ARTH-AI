// ============================================================
// ARTH Backend — Custom API Error Class
// Distinguishes between validation, auth, not-found, and
// server errors with appropriate HTTP status codes.
// ============================================================

class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {string} [type] - Error type (VALIDATION, AUTH, NOT_FOUND, SERVER)
   */
  constructor(statusCode, message, type = 'SERVER') {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.isOperational = true; // Marks this as a known/expected error

    // Capture stack trace for debugging
    Error.captureStackTrace(this, this.constructor);
  }

  // --- Factory methods for common error types ---

  static badRequest(message = 'Bad request') {
    return new ApiError(400, message, 'VALIDATION');
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message, 'AUTH');
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message, 'AUTH');
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message, 'NOT_FOUND');
  }

  static internal(message = 'Internal server error') {
    return new ApiError(500, message, 'SERVER');
  }
}

module.exports = ApiError;
