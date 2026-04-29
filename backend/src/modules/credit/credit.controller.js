// ============================================================
// ARTH Backend — Credit Controller
// ============================================================

const creditService = require('./credit.service');

/**
 * POST /api/credit/score
 */
const getScore = async (req, res) => {
  const result = await creditService.getScore(req.user.id, req.body);

  res.status(200).json({
    success: true,
    data: result,
    message: 'Credit score calculated successfully.',
  });
};

/**
 * POST /api/credit/explain
 */
const getExplanation = async (req, res) => {
  const result = await creditService.getExplanation(req.user.id, req.body);

  res.status(200).json({
    success: true,
    data: result,
    message: 'Credit explanation generated successfully.',
  });
};

module.exports = { getScore, getExplanation };
