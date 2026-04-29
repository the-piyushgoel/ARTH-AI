// ============================================================
// ARTH Backend — Fraud Routes
// ============================================================

const express = require('express');
const router = express.Router();
const fraudController = require('./fraud.controller');
const asyncHandler = require('../../utils/asyncHandler');
const authMiddleware = require('../../middlewares/authMiddleware');

router.use(authMiddleware);

// POST /api/fraud/detect
router.post('/detect', asyncHandler(fraudController.detect));

module.exports = router;
