// ============================================================
// ARTH Backend — Auth Routes
// Maps URL paths to auth controller methods.
// ============================================================

const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const asyncHandler = require('../../utils/asyncHandler');
const validateRequest = require('../../middlewares/validateRequest');

// POST /api/auth/register
router.post(
  '/register',
  validateRequest(['name', 'email', 'password']),
  asyncHandler(authController.register)
);

// POST /api/auth/login
router.post(
  '/login',
  validateRequest(['email', 'password']),
  asyncHandler(authController.login)
);

module.exports = router;
