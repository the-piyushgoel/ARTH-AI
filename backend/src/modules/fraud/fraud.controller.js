// ============================================================
// ARTH Backend — Fraud Controller
// ============================================================

const fraudService = require('./fraud.service');

/**
 * POST /api/fraud/detect
 */
const detect = async (req, res) => {
  const result = await fraudService.detect(req.user.id, req.body);

  res.status(200).json({
    success: true,
    data: result,
    message: 'Fraud analysis completed.',
  });
};

module.exports = { detect };
