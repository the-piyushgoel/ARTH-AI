// ============================================================
// ARTH Backend — Auth Service
// Handles registration and login business logic.
// ============================================================

const jwt = require('jsonwebtoken');
const User = require('./auth.model');
const config = require('../../config');
const ApiError = require('../../utils/ApiError');
const logger = require('../../utils/logger');

/**
 * Generates a JWT token for the given user.
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
};

/**
 * Register a new user.
 * @param {object} userData - { name, email, password }
 * @returns {object} { user, token }
 */
const register = async (userData) => {
  const { name, email, password } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.badRequest('User with this email already exists.');
  }

  // Create new user
  const user = await User.create({ name, email, password });
  logger.info(`New user registered: ${email}`);

  // Generate token
  const token = generateToken(user);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

/**
 * Login an existing user.
 * @param {string} email
 * @param {string} password
 * @returns {object} { user, token }
 */
const login = async (email, password) => {
  // Find user and explicitly include password field
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  // Compare passwords
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  logger.info(`User logged in: ${email}`);

  const token = generateToken(user);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

module.exports = { register, login };
