// ============================================================
// ARTH Backend — User Controller
// ============================================================

const userService = require('./user.service');

/**
 * GET /api/user/profile
 */
const getProfile = async (req, res) => {
  const profile = await userService.getProfile(req.user.id);

  res.status(200).json({
    success: true,
    data: profile,
  });
};

/**
 * PUT /api/user/profile
 */
const updateProfile = async (req, res) => {
  const profile = await userService.updateProfile(req.user.id, req.body);

  res.status(200).json({
    success: true,
    data: profile,
    message: 'Profile updated successfully.',
  });
};

module.exports = { getProfile, updateProfile };
