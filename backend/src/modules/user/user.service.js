// ============================================================
// ARTH Backend — User Service
// Business logic for user profile operations.
// ============================================================

const User = require('./user.model');
const ApiError = require('../../utils/ApiError');

/**
 * Get user profile by ID.
 * @param {string} userId
 * @returns {object} User profile
 */
const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('User not found.');
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    income: user.income,
    balance: user.balance,
    createdAt: user.createdAt,
  };
};

/**
 * Update user profile.
 * @param {string} userId
 * @param {object} updateData - Fields to update
 * @returns {object} Updated user profile
 */
const updateProfile = async (userId, updateData) => {
  // Only allow updating specific fields
  const allowedUpdates = ['name', 'income', 'balance'];
  const updates = {};
  for (const key of allowedUpdates) {
    if (updateData[key] !== undefined) {
      updates[key] = updateData[key];
    }
  }

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw ApiError.notFound('User not found.');
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    income: user.income,
    balance: user.balance,
  };
};

module.exports = { getProfile, updateProfile };
