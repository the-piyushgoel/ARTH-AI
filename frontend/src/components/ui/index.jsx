// ============================================================
// ARTH Frontend — Reusable UI Components
// Card, Button, Input, Loader, StatusBadge, Modal
// ============================================================

// ---- Card ----
export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div className={`${hover ? 'glass-card-hover' : 'glass-card'} p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

// ---- Stat Card ----
export function StatCard({ title, value, subtitle, icon, trend, color = 'primary' }) {
  const colorMap = {
    primary: 'from-primary-500/20 to-primary-500/5 text-primary-400',
    accent: 'from-accent-500/20 to-accent-500/5 text-accent-400',
    green: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400',
    red: 'from-red-500/20 to-red-500/5 text-red-400',
    yellow: 'from-amber-500/20 to-amber-500/5 text-amber-400',
  };

  return (
    <div className="glass-card-hover p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colorMap[color]} 
                        flex items-center justify-center`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full 
            ${trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-surface-200/50 text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {subtitle && <p className="text-xs text-surface-200/40 mt-1">{subtitle}</p>}
    </div>
  );
}

// ---- Loader ----
export function Loader({ size = 'md', text = 'Loading...' }) {
  const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-14 h-14' };
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className={`${sizes[size]} border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin`} />
      <p className="text-surface-200/50 text-sm">{text}</p>
    </div>
  );
}

// ---- Status Badge ----
export function StatusBadge({ status, size = 'md' }) {
  const statusStyles = {
    SAFE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    LOW: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    HIGH: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    CRITICAL: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <span className={`inline-flex items-center font-semibold rounded-full border
      ${statusStyles[status] || statusStyles.LOW} ${sizeStyles[size]}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-2 
        ${status === 'SAFE' || status === 'LOW' ? 'bg-current' : 'bg-current animate-pulse'}`} />
      {status}
    </span>
  );
}

// ---- Empty State ----
export function EmptyState({ title, message, icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-700/50 flex items-center justify-center mb-4">
        {icon || (
          <svg className="w-8 h-8 text-surface-200/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        )}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-surface-200/50 text-sm max-w-md">{message}</p>
    </div>
  );
}
