// ============================================================
// ARTH Backend — Transaction Controller
// ============================================================

const transactionService = require('./transaction.service');

/**
 * POST /api/transactions
 */
const createTransaction = async (req, res) => {
  const transaction = await transactionService.createTransaction(
    req.user.id,
    req.body
  );

  res.status(201).json({
    success: true,
    data: transaction,
    message: 'Transaction created successfully.',
  });
};

/**
 * GET /api/transactions
 */
const getUserTransactions = async (req, res) => {
  const filters = {
    type: req.query.type,
    category: req.query.category,
    limit: parseInt(req.query.limit) || 50,
  };

  const transactions = await transactionService.getUserTransactions(
    req.user.id,
    filters
  );

  res.status(200).json({
    success: true,
    data: transactions,
  });
};

/**
 * GET /api/transactions/summary
 */
const getTransactionSummary = async (req, res) => {
  const summary = await transactionService.getTransactionSummary(req.user.id);

  res.status(200).json({
    success: true,
    data: summary,
  });
};

module.exports = { createTransaction, getUserTransactions, getTransactionSummary };
