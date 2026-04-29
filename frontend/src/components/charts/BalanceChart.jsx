// ============================================================
// ARTH Frontend — Balance Chart Component
// Recharts-based line chart for financial predictions.
// ============================================================

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border border-white/10">
        <p className="text-sm font-medium text-white">Month {label}</p>
        <p className="text-sm text-primary-400">
          Balance: ${payload[0].value?.toLocaleString()}
        </p>
        {payload[0].payload.confidence && (
          <p className="text-xs text-surface-200/50">
            Confidence: {(payload[0].payload.confidence * 100).toFixed(0)}%
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function BalanceChart({ data = [], height = 300 }) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-surface-200/40 text-sm">No prediction data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3391ff" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3391ff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="month"
          stroke="rgba(255,255,255,0.2)"
          tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
          tickFormatter={(v) => `M${v}`}
        />
        <YAxis
          stroke="rgba(255,255,255,0.2)"
          tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="predicted_balance"
          stroke="#3391ff"
          strokeWidth={2}
          fill="url(#balanceGradient)"
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
