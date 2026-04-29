// ============================================================
// ARTH Backend — Async Handler Utility
// Wraps async controller functions with try-catch so that
// unhandled promise rejections flow to the error middleware.
// ============================================================

/**
 * Wraps an async Express route handler to catch errors automatically.
 * Usage: router.get('/path', asyncHandler(myController));
 *
 * @param {Function} fn - Async function (req, res, next)
 * @returns {Function} Express middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
