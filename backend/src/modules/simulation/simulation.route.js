// ============================================================
// ARTH Backend — Simulation Routes
// ============================================================

const express = require('express');
const router = express.Router();
const simulationController = require('./simulation.controller');
const asyncHandler = require('../../utils/asyncHandler');
const authMiddleware = require('../../middlewares/authMiddleware');

router.use(authMiddleware);

// POST /api/simulation/predict
router.post('/predict', asyncHandler(simulationController.predict));

module.exports = router;
