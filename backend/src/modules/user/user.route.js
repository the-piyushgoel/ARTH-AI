// ============================================================
// ARTH Backend — User Routes
// ============================================================

const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const asyncHandler = require('../../utils/asyncHandler');
const authMiddleware = require('../../middlewares/authMiddleware');

// All user routes require authentication
router.use(authMiddleware);

// GET /api/user/profile
router.get('/profile', asyncHandler(userController.getProfile));

// PUT /api/user/profile
router.put('/profile', asyncHandler(userController.updateProfile));

module.exports = router;
