// ============================================================
// ARTH Backend — Simulation Controller
// ============================================================

const simulationService = require('./simulation.service');

/**
 * POST /api/simulation/predict
 */
const predict = async (req, res) => {
  const result = await simulationService.predict(req.user.id, req.body);

  res.status(200).json({
    success: true,
    data: result,
    message: 'Financial prediction generated successfully.',
  });
};

module.exports = { predict };
