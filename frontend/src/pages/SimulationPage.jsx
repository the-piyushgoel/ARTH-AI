// ============================================================
// ARTH Frontend — Simulation Page (AI Financial Twin)
// Predicts future financial outcomes using ML.
// ============================================================

import { useState } from 'react';
import { Card, StatusBadge, Loader } from '../components/ui';
import BalanceChart from '../components/charts/BalanceChart';
import RiskGauge from '../components/charts/RiskGauge';
import { simulationAPI } from '../services/api';
import useApi from '../hooks/useApi';

export default function SimulationPage() {
  const [income, setIncome] = useState('5000');
  const [expenses, setExpenses] = useState('3500');
  const [months, setMonths] = useState('6');
  const { data, error, loading, execute } = useApi(simulationAPI.predict);

  const handlePredict = async (e) => {
    e.preventDefault();
    await execute({
      income: parseFloat(income),
      expenses: parseFloat(expenses),
      months_ahead: parseInt(months),
    });
  };

  const prediction = data?.prediction || data;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-blue-500 
                          flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          AI Financial Twin
        </h1>
        <p className="section-subtitle">Simulate and predict your financial future with machine learning</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <Card className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-white mb-4">Simulation Parameters</h3>
          <form onSubmit={handlePredict} className="space-y-4">
            <div>
              <label htmlFor="sim-income" className="block text-sm text-surface-200/60 mb-1.5">
                Monthly Income ($)
              </label>
              <input
                id="sim-income"
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="input-field"
                min="0"
                step="100"
                required
              />
            </div>

            <div>
              <label htmlFor="sim-expenses" className="block text-sm text-surface-200/60 mb-1.5">
                Monthly Expenses ($)
              </label>
              <input
                id="sim-expenses"
                type="number"
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
                className="input-field"
                min="0"
                step="100"
                required
              />
            </div>

            <div>
              <label htmlFor="sim-months" className="block text-sm text-surface-200/60 mb-1.5">
                Forecast Period (Months)
              </label>
              <input
                id="sim-months"
                type="number"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
                className="input-field"
                min="1"
                max="24"
                required
              />
            </div>

            <button id="sim-submit" type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Predicting...' : '🔮 Run Prediction'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {loading && <Loader text="Running AI simulation..." />}

          {prediction && !loading && (
            <>
              {/* Risk Score + Predicted Balance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <RiskGauge
                    value={prediction.risk_score || 0}
                    max={100}
                    label="Financial Risk"
                  />
                  <div className="text-center mt-2">
                    <StatusBadge status={prediction.risk_level || 'LOW'} size="md" />
                  </div>
                </Card>

                <Card>
                  <div className="text-center py-4">
                    <p className="text-surface-200/50 text-sm mb-2">Predicted Balance</p>
                    <p className="text-4xl font-bold gradient-text">
                      ${prediction.predicted_balance?.toLocaleString() || '0'}
                    </p>
                    <p className="text-surface-200/40 text-xs mt-2">
                      Savings Rate: {prediction.savings_rate || 0}%
                    </p>
                  </div>
                  <div className="mt-4 p-3 rounded-xl bg-primary-500/5 border border-primary-500/10">
                    <p className="text-xs text-surface-200/60">
                      💡 {prediction.recommendation || 'Run a prediction to get personalized advice.'}
                    </p>
                  </div>
                </Card>
              </div>

              {/* Balance Chart */}
              <Card>
                <h3 className="text-lg font-semibold text-white mb-4">Balance Trajectory</h3>
                <BalanceChart data={prediction.monthly_predictions || []} height={320} />
              </Card>
            </>
          )}

          {!prediction && !loading && (
            <Card className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-primary-500/10 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-primary-400/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Ready to Predict</h3>
              <p className="text-surface-200/50 text-sm text-center max-w-md">
                Enter your financial parameters and let our AI Financial Twin predict your future balance and risk levels.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
