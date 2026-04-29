// ============================================================
// ARTH Backend — Credit Service
// Prepares behavioral data and calls ML for credit scoring.
// ============================================================

const mlClient = require('../../integrations/mlClient');
const transactionService = require('../transaction/transaction.service');
const logger = require('../../utils/logger');

/**
 * Get credit score for a user.
 */
const getScore = async (userId, inputData = {}) => {
  const summary = await transactionService.getTransactionSummary(userId);

  const payload = {
    income: inputData.income || summary.totalIncome,
    expenses: inputData.expenses || summary.totalExpenses,
    transaction_count: summary.transactionCount,
    net_balance: summary.netBalance,
    // Behavioral signals
    expense_to_income_ratio: summary.totalIncome > 0
      ? summary.totalExpenses / summary.totalIncome
      : 1,
    category_diversity: Object.keys(summary.categoryBreakdown).length,
    avg_transaction_amount: summary.transactionCount > 0
      ? (summary.totalIncome + summary.totalExpenses) / summary.transactionCount
      : 0,
  };

  logger.info(`Credit score request for user ${userId}`);

  const result = await mlClient.getCreditScore(payload);

  return {
    score: result,
    financialSummary: {
      totalIncome: summary.totalIncome,
      totalExpenses: summary.totalExpenses,
      netBalance: summary.netBalance,
    },
  };
};

/**
 * Get credit score explanation for a user.
 */
const getExplanation = async (userId, inputData = {}) => {
  const summary = await transactionService.getTransactionSummary(userId);

  const payload = {
    income: inputData.income || summary.totalIncome,
    expenses: inputData.expenses || summary.totalExpenses,
    transaction_count: summary.transactionCount,
    net_balance: summary.netBalance,
    expense_to_income_ratio: summary.totalIncome > 0
      ? summary.totalExpenses / summary.totalIncome
      : 1,
    category_diversity: Object.keys(summary.categoryBreakdown).length,
    avg_transaction_amount: summary.transactionCount > 0
      ? (summary.totalIncome + summary.totalExpenses) / summary.transactionCount
      : 0,
  };

  logger.info(`Credit explanation request for user ${userId}`);

  const result = await mlClient.getCreditExplanation(payload);

  return {
    explanation: result,
    financialSummary: {
      totalIncome: summary.totalIncome,
      totalExpenses: summary.totalExpenses,
      categoryBreakdown: summary.categoryBreakdown,
    },
  };
};

module.exports = { getScore, getExplanation };
