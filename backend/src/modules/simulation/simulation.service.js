// ============================================================
// ARTH Backend — Simulation Service
// Prepares financial data and calls ML service for prediction.
// ============================================================

const mlClient = require('../../integrations/mlClient');
const transactionService = require('../transaction/transaction.service');
const logger = require('../../utils/logger');

/**
 * Predict future financial outcomes for a user.
 * @param {string} userId
 * @param {object} inputData - Optional override data
 * @returns {object} Prediction results
 */
const predict = async (userId, inputData = {}) => {
  // Get user's transaction summary
  const summary = await transactionService.getTransactionSummary(userId);

  // Prepare payload for ML service
  const payload = {
    income: inputData.income || summary.totalIncome,
    expenses: inputData.expenses || summary.totalExpenses,
    transaction_count: summary.transactionCount,
    net_balance: summary.netBalance,
    // Monthly averages (approximate)
    avg_monthly_income: (inputData.income || summary.totalIncome) / Math.max(1, Math.ceil(summary.transactionCount / 10)),
    avg_monthly_expenses: (inputData.expenses || summary.totalExpenses) / Math.max(1, Math.ceil(summary.transactionCount / 10)),
    months_ahead: inputData.months_ahead || 6,
  };

  logger.info(`Simulation predict for user ${userId}`, payload);

  // Call ML service
  const prediction = await mlClient.predictSimulation(payload);

  return {
    currentBalance: summary.netBalance,
    prediction,
    summary: {
      totalIncome: summary.totalIncome,
      totalExpenses: summary.totalExpenses,
      transactionCount: summary.transactionCount,
    },
  };
};

module.exports = { predict };
