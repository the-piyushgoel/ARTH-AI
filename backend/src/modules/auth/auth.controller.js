// ============================================================
// ARTH Backend — Auth Controller
// Handles HTTP request/response for auth endpoints.
// No business logic here — delegates to auth.service.
// ============================================================

const authService = require('./auth.service');

/**
 * POST /api/auth/register
 */
const register = async (req, res) => {
  const result = await authService.register(req.body);

  res.status(201).json({
    success: true,
    data: result,
    message: 'User registered successfully.',
  });
};

/**
 * POST /api/auth/login
 */
const login = async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);

  res.status(200).json({
    success: true,
    data: result,
    message: 'Login successful.',
  });
};

module.exports = { register, login };
