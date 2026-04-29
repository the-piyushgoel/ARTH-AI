// ============================================================
// ARTH Backend — Fraud Detection Service
// Analyzes transaction behavior and calls ML for fraud risk.
// ============================================================

const mlClient = require('../../integrations/mlClient');
const transactionService = require('../transaction/transaction.service');
const logger = require('../../utils/logger');

/**
 * Detect fraud risk for a transaction or user behavior.
 */
const detect = async (userId, transactionData = {}) => {
  const summary = await transactionService.getTransactionSummary(userId);

  // Calculate behavioral features for fraud detection
  const avgAmount = summary.transactionCount > 0
    ? (summary.totalIncome + summary.totalExpenses) / summary.transactionCount
    : 0;

  const payload = {
    // Transaction-level features
    amount: transactionData.amount || 0,
    category: transactionData.category || 'unknown',
    location: transactionData.location || 'unknown',
    device: transactionData.device || 'unknown',
    hour_of_day: transactionData.hour_of_day || new Date().getHours(),

    // User behavioral features
    avg_transaction_amount: avgAmount,
    transaction_count: summary.transactionCount,
    total_income: summary.totalIncome,
    total_expenses: summary.totalExpenses,

    // Anomaly indicators
    amount_deviation: avgAmount > 0
      ? Math.abs((transactionData.amount || 0) - avgAmount) / avgAmount
      : 0,
    is_new_category: transactionData.category
      ? !summary.categoryBreakdown[transactionData.category]
      : false,
  };

  logger.info(`Fraud detection request for user ${userId}`, {
    amount: payload.amount,
    category: payload.category,
  });

  const result = await mlClient.detectFraud(payload);

  return {
    fraudAnalysis: result,
    transactionDetails: {
      amount: payload.amount,
      category: payload.category,
      location: payload.location,
    },
    behavioralContext: {
      avgTransactionAmount: avgAmount,
      totalTransactions: summary.transactionCount,
    },
  };
};

module.exports = { detect };
