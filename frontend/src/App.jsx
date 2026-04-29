// ============================================================
// ARTH Frontend — App Component
// Root component with routing configuration.
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './store/authStore';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import SimulationPage from './pages/SimulationPage';
import CreditPage from './pages/CreditPage';
import FraudPage from './pages/FraudPage';
import TransactionsPage from './pages/TransactionsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes (wrapped in Layout with auth guard) */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="simulation" element={<SimulationPage />} />
            <Route path="credit" element={<CreditPage />} />
            <Route path="fraud" element={<FraudPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
