// ============================================================
// ARTH Frontend — Credit Score Page
// ============================================================

import { useState } from 'react';
import { Card, StatusBadge, Loader } from '../components/ui';
import RiskGauge from '../components/charts/RiskGauge';
import { creditAPI } from '../services/api';
import useApi from '../hooks/useApi';

export default function CreditPage() {
  const [income, setIncome] = useState('5000');
  const [expenses, setExpenses] = useState('3000');
  const [txCount, setTxCount] = useState('50');

  const scoreApi = useApi(creditAPI.getScore);
  const explainApi = useApi(creditAPI.getExplanation);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    const payload = {
      income: parseFloat(income),
      expenses: parseFloat(expenses),
      transaction_count: parseInt(txCount),
    };
    await Promise.all([scoreApi.execute(payload), explainApi.execute(payload)]);
  };

  const score = scoreApi.data?.score || scoreApi.data;
  const explanation = explainApi.data?.explanation || explainApi.data;
  const loading = scoreApi.loading || explainApi.loading;
  const error = scoreApi.error || explainApi.error;

  const getGradeColor = (grade) => {
    const c = { A:'from-emerald-500 to-green-500', B:'from-blue-500 to-cyan-500',
                C:'from-amber-500 to-yellow-500', D:'from-orange-500 to-red-500', F:'from-red-500 to-rose-600' };
    return c[grade] || c.C;
  };

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="section-title flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-pink-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          Explainable AI Credit Score
        </h1>
        <p className="section-subtitle">Transparent credit scoring with explanations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-white mb-4">Financial Profile</h3>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label htmlFor="credit-income" className="block text-sm text-surface-200/60 mb-1.5">Income ($)</label>
              <input id="credit-income" type="number" value={income} onChange={(e) => setIncome(e.target.value)} className="input-field" min="0" required />
            </div>
            <div>
              <label htmlFor="credit-expenses" className="block text-sm text-surface-200/60 mb-1.5">Expenses ($)</label>
              <input id="credit-expenses" type="number" value={expenses} onChange={(e) => setExpenses(e.target.value)} className="input-field" min="0" required />
            </div>
            <div>
              <label htmlFor="credit-txcount" className="block text-sm text-surface-200/60 mb-1.5">Transactions</label>
              <input id="credit-txcount" type="number" value={txCount} onChange={(e) => setTxCount(e.target.value)} className="input-field" min="0" required />
            </div>
            <button id="credit-submit" type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Analyzing...' : '🛡️ Analyze Credit'}
            </button>
          </form>
          {error && <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {loading && <Loader text="Analyzing credit profile..." />}

          {score && !loading && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <RiskGauge value={score.score || 0} max={850} label="Credit Score"
                    colorStops={[{offset:0,color:'#f87171'},{offset:0.5,color:'#fbbf24'},{offset:1,color:'#34d399'}]} />
                  <div className="text-center mt-3">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${getGradeColor(score.grade)} text-white font-bold`}>
                      Grade {score.grade}
                    </div>
                  </div>
                </Card>
                <Card>
                  <h4 className="text-sm text-surface-200/50 mb-3">Risk Assessment</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-surface-200/70">Risk Level</span>
                      <StatusBadge status={score.risk_level || 'MEDIUM'} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-surface-200/70">Score</span>
                      <span className="text-lg font-bold text-white">{score.score}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-surface-200/70">Grade</span>
                      <span className="text-lg font-bold text-white">{score.grade}</span>
                    </div>
                  </div>
                </Card>
              </div>

              {explanation && (
                <>
                  <Card>
                    <h3 className="text-lg font-semibold text-white mb-3">AI Explanation</h3>
                    <p className="text-surface-200/60 text-sm leading-relaxed mb-4">{explanation.summary}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                        <h4 className="text-sm font-semibold text-emerald-400 mb-2">✓ Positive</h4>
                        <ul className="space-y-1">
                          {(explanation.positive_factors||[]).map((f,i) => (
                            <li key={i} className="text-xs text-surface-200/60 flex gap-2"><span className="text-emerald-400">•</span>{f}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                        <h4 className="text-sm font-semibold text-red-400 mb-2">✗ Improve</h4>
                        <ul className="space-y-1">
                          {(explanation.negative_factors||[]).map((f,i) => (
                            <li key={i} className="text-xs text-surface-200/60 flex gap-2"><span className="text-red-400">•</span>{f}</li>
                          ))}
                          {(!explanation.negative_factors?.length) && <li className="text-xs text-surface-200/40">None!</li>}
                        </ul>
                      </div>
                    </div>
                  </Card>
                  <Card>
                    <h3 className="text-lg font-semibold text-white mb-3">💡 Suggestions</h3>
                    <div className="space-y-2">
                      {(explanation.suggestions||[]).map((s,i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-primary-500/5 border border-primary-500/10">
                          <span className="text-primary-400 font-bold text-sm">{i+1}</span>
                          <p className="text-sm text-surface-200/70">{s}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </>
              )}
            </>
          )}

          {!score && !loading && (
            <Card className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-accent-500/10 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-accent-400/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Credit Analysis Ready</h3>
              <p className="text-surface-200/50 text-sm text-center max-w-md">
                Enter your financial profile for a transparent, explainable credit score.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
