// ============================================================
// ARTH Backend — Transaction Service
// ============================================================

const Transaction = require('./transaction.model');
const ApiError = require('../../utils/ApiError');
const logger = require('../../utils/logger');

/**
 * Create a new transaction.
 */
const createTransaction = async (userId, transactionData) => {
  const transaction = await Transaction.create({
    userId,
    ...transactionData,
  });

  logger.info(`Transaction created: ${transaction._id} for user ${userId}`);
  return transaction;
};

/**
 * Get all transactions for a user with optional filters.
 */
const getUserTransactions = async (userId, filters = {}) => {
  const query = { userId };

  if (filters.type) query.type = filters.type;
  if (filters.category) query.category = filters.category;

  const transactions = await Transaction.find(query)
    .sort({ date: -1 })
    .limit(filters.limit || 50);

  return transactions;
};

/**
 * Get transaction summary for a user (used by simulation/credit).
 */
const getTransactionSummary = async (userId) => {
  const transactions = await Transaction.find({ userId }).sort({ date: -1 });

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Group expenses by category
  const categoryBreakdown = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
    });

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    transactionCount: transactions.length,
    categoryBreakdown,
    recentTransactions: transactions.slice(0, 10),
  };
};

module.exports = { createTransaction, getUserTransactions, getTransactionSummary };
