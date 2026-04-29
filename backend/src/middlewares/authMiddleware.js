// ============================================================
// ARTH Backend — Auth Middleware
// Verifies JWT token from Authorization header.
// Attaches decoded user to req.user for downstream use.
// ============================================================

const jwt = require('jsonwebtoken');
const config = require('../config');
const ApiError = require('../utils/ApiError');

const authMiddleware = (req, _res, next) => {
  try {
    // Extract token from "Bearer <token>" header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No token provided. Please log in.');
    }

    const token = authHeader.split(' ')[1];

    // Verify and decode the token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Attach user info to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else if (error.name === 'JsonWebTokenError') {
      next(ApiError.unauthorized('Invalid token.'));
    } else if (error.name === 'TokenExpiredError') {
      next(ApiError.unauthorized('Token expired. Please log in again.'));
    } else {
      next(ApiError.unauthorized('Authentication failed.'));
    }
  }
};

module.exports = authMiddleware;
