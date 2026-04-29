// ============================================================
// ARTH Frontend — Transactions Page
// ============================================================

import { useState } from 'react';
import { Card, EmptyState } from '../components/ui';
import { transactionAPI } from '../services/api';
import useApi from '../hooks/useApi';

export default function TransactionsPage() {
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('food');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const createApi = useApi(transactionAPI.create);
  const listApi = useApi(transactionAPI.getAll);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createApi.execute({ type, category, amount: parseFloat(amount), description });
    setAmount('');
    setDescription('');
    listApi.execute();
  };

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="section-title">Transactions</h1>
        <p className="section-subtitle">Add and manage your financial transactions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-white mb-4">Add Transaction</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label htmlFor="tx-type" className="block text-sm text-surface-200/60 mb-1.5">Type</label>
              <select id="tx-type" value={type} onChange={(e) => setType(e.target.value)} className="input-field">
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label htmlFor="tx-category" className="block text-sm text-surface-200/60 mb-1.5">Category</label>
              <select id="tx-category" value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
                <option value="salary">Salary</option>
                <option value="food">Food</option>
                <option value="rent">Rent</option>
                <option value="shopping">Shopping</option>
                <option value="entertainment">Entertainment</option>
                <option value="transport">Transport</option>
                <option value="utilities">Utilities</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="tx-amount" className="block text-sm text-surface-200/60 mb-1.5">Amount ($)</label>
              <input id="tx-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                     className="input-field" min="0" step="0.01" required />
            </div>
            <div>
              <label htmlFor="tx-desc" className="block text-sm text-surface-200/60 mb-1.5">Description</label>
              <input id="tx-desc" type="text" value={description} onChange={(e) => setDescription(e.target.value)}
                     className="input-field" placeholder="Optional" />
            </div>
            <button id="tx-submit" type="submit" disabled={createApi.loading} className="btn-primary w-full">
              {createApi.loading ? 'Saving...' : '+ Add Transaction'}
            </button>
          </form>
          {createApi.error && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {createApi.error}
            </div>
          )}
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
              <button onClick={() => listApi.execute()} className="btn-secondary text-sm py-2 px-4">
                Load Transactions
              </button>
            </div>
            {listApi.data && Array.isArray(listApi.data) && listApi.data.length > 0 ? (
              <div className="space-y-2">
                {listApi.data.map((tx, i) => (
                  <div key={tx._id || i}
                       className="flex items-center justify-between p-3 rounded-xl bg-surface-800/50 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {tx.type === 'income' ? '+' : '-'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{tx.category}</p>
                        <p className="text-xs text-surface-200/40">{tx.description || 'No description'}</p>
                      </div>
                    </div>
                    <span className={`font-semibold ${tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount?.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No transactions yet" message="Add your first transaction to get started with AI analysis." />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
