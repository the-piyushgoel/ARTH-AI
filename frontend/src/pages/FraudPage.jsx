// ============================================================
// ARTH Frontend — Fraud Detection Page
// ============================================================

import { useState } from 'react';
import { Card, StatusBadge, Loader } from '../components/ui';
import RiskGauge from '../components/charts/RiskGauge';
import { fraudAPI } from '../services/api';
import useApi from '../hooks/useApi';

export default function FraudPage() {
  const [amount, setAmount] = useState('500');
  const [category, setCategory] = useState('shopping');
  const [location, setLocation] = useState('online');
  const [hour, setHour] = useState('14');
  const { data, error, loading, execute } = useApi(fraudAPI.detect);

  const handleDetect = async (e) => {
    e.preventDefault();
    await execute({
      amount: parseFloat(amount),
      category,
      location,
      hour_of_day: parseInt(hour),
    });
  };

  const result = data?.fraudAnalysis || data;

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="section-title flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          Behavioral AI Fraud Detection
        </h1>
        <p className="section-subtitle">Real-time fraud detection powered by behavioral intelligence</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-white mb-4">Transaction Details</h3>
          <form onSubmit={handleDetect} className="space-y-4">
            <div>
              <label htmlFor="fraud-amount" className="block text-sm text-surface-200/60 mb-1.5">Amount ($)</label>
              <input id="fraud-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                     className="input-field" min="0" required />
            </div>
            <div>
              <label htmlFor="fraud-category" className="block text-sm text-surface-200/60 mb-1.5">Category</label>
              <select id="fraud-category" value={category} onChange={(e) => setCategory(e.target.value)}
                      className="input-field">
                <option value="shopping">Shopping</option>
                <option value="food">Food & Dining</option>
                <option value="entertainment">Entertainment</option>
                <option value="travel">Travel</option>
                <option value="transfer">Transfer</option>
                <option value="atm">ATM Withdrawal</option>
                <option value="crypto">Cryptocurrency</option>
              </select>
            </div>
            <div>
              <label htmlFor="fraud-location" className="block text-sm text-surface-200/60 mb-1.5">Location</label>
              <input id="fraud-location" type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                     className="input-field" />
            </div>
            <div>
              <label htmlFor="fraud-hour" className="block text-sm text-surface-200/60 mb-1.5">Hour (0-23)</label>
              <input id="fraud-hour" type="number" value={hour} onChange={(e) => setHour(e.target.value)}
                     className="input-field" min="0" max="23" required />
            </div>
            <button id="fraud-submit" type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Scanning...' : '🔍 Detect Fraud'}
            </button>
          </form>
          {error && <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {loading && <Loader text="Analyzing transaction behavior..." />}

          {result && !loading && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <RiskGauge value={(result.fraud_probability || 0) * 100} max={100} label="Fraud Risk" />
                  <div className="text-center mt-2">
                    <StatusBadge status={result.risk_level || 'SAFE'} size="md" />
                  </div>
                </Card>
                <Card>
                  <h4 className="text-sm text-surface-200/50 mb-4">Analysis Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-surface-200/60">Fraud Probability</span>
                      <span className="font-bold text-white">{((result.fraud_probability || 0) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-surface-200/60">Suspicious</span>
                      <span className={`font-bold ${result.is_suspicious ? 'text-red-400' : 'text-emerald-400'}`}>
                        {result.is_suspicious ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 rounded-xl bg-primary-500/5 border border-primary-500/10">
                    <p className="text-xs text-surface-200/60">💡 {result.recommendation}</p>
                  </div>
                </Card>
              </div>

              <Card>
                <h3 className="text-lg font-semibold text-white mb-4">Risk Indicators</h3>
                <div className="space-y-3">
                  {(result.indicators || []).map((ind, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-surface-800/50 border border-white/5">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        ind.severity === 'HIGH' ? 'bg-red-400' : ind.severity === 'MEDIUM' ? 'bg-amber-400' : 'bg-blue-400'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-white">{ind.indicator}</p>
                        <p className="text-xs text-surface-200/50 mt-0.5">{ind.description}</p>
                      </div>
                      <StatusBadge status={ind.severity} size="sm" />
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {!result && !loading && (
            <Card className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-red-400/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Fraud Scanner Ready</h3>
              <p className="text-surface-200/50 text-sm text-center max-w-md">
                Enter transaction details to analyze fraud risk using behavioral AI.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
