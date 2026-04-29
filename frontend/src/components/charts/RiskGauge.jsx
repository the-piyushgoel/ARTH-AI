// ============================================================
// ARTH Frontend — Risk Gauge Component
// Animated SVG gauge for displaying risk/credit scores.
// ============================================================

import { useEffect, useState } from 'react';

export default function RiskGauge({ 
  value = 0, 
  max = 100, 
  label = 'Risk Score',
  size = 200,
  colorStops = [
    { offset: 0, color: '#34d399' },    // green
    { offset: 0.5, color: '#fbbf24' },   // yellow
    { offset: 1, color: '#f87171' },     // red
  ]
}) {
  const [animatedValue, setAnimatedValue] = useState(0);

  // Animate on mount/value change
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const radius = 80;
  const strokeWidth = 12;
  const circumference = Math.PI * radius; // Half circle
  const progress = (animatedValue / max) * circumference;
  const gradientId = `gauge-gradient-${label.replace(/\s/g, '')}`;

  // Determine color based on value
  const getColor = () => {
    const ratio = value / max;
    if (ratio < 0.3) return '#34d399';
    if (ratio < 0.6) return '#fbbf24';
    if (ratio < 0.8) return '#fb923c';
    return '#f87171';
  };

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size * 0.6} viewBox="0 0 200 120" className="overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            {colorStops.map((stop, i) => (
              <stop key={i} offset={`${stop.offset * 100}%`} stopColor={stop.color} />
            ))}
          </linearGradient>
        </defs>

        {/* Background arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Progress arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-1000 ease-out"
        />

        {/* Center value */}
        <text x="100" y="85" textAnchor="middle" className="fill-white text-3xl font-bold" fontSize="32">
          {Math.round(animatedValue)}
        </text>
        <text x="100" y="105" textAnchor="middle" className="fill-surface-200/50" fontSize="11">
          {label}
        </text>
      </svg>
    </div>
  );
}
