// ============================================================
// ARTH Frontend — Navbar Component
// Top navigation bar with branding and user menu.
// ============================================================

import { useAuth } from '../../store/authStore';

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth();

  return (
    <nav className="h-16 bg-surface-900/80 backdrop-blur-xl border-b border-white/[0.06] 
                     flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Left: Menu toggle + Brand */}
      <div className="flex items-center gap-4">
        <button
          id="menu-toggle"
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-surface-700/50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-3">
          {/* ARTH Logo */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 
                          flex items-center justify-center shadow-glow">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">ARTH</h1>
            <p className="text-[10px] text-surface-200/40 -mt-1 hidden sm:block">Financial Intelligence</p>
          </div>
        </div>
      </div>

      {/* Right: User info + Logout */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
          <p className="text-xs text-surface-200/50">{user?.email || ''}</p>
        </div>
        
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 
                        border border-white/10 flex items-center justify-center">
          <span className="text-sm font-semibold text-primary-400">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>

        <button
          id="logout-btn"
          onClick={logout}
          className="p-2 rounded-lg hover:bg-red-500/10 text-surface-200/60 hover:text-red-400 transition-all"
          title="Logout"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
