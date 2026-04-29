// ============================================================
// ARTH Backend — Credit Routes
// ============================================================

const express = require('express');
const router = express.Router();
const creditController = require('./credit.controller');
const asyncHandler = require('../../utils/asyncHandler');
const authMiddleware = require('../../middlewares/authMiddleware');

router.use(authMiddleware);

// POST /api/credit/score
router.post('/score', asyncHandler(creditController.getScore));

// POST /api/credit/explain
router.post('/explain', asyncHandler(creditController.getExplanation));

module.exports = router;
