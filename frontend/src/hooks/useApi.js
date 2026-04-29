// ============================================================
// ARTH Frontend — useApi Hook
// Reusable hook for API calls with loading/error state.
// ============================================================

import { useState, useCallback } from 'react';

/**
 * Custom hook for making API calls with loading and error state.
 * 
 * Usage:
 *   const { data, error, loading, execute } = useApi(simulationAPI.predict);
 *   execute({ income: 5000, expenses: 3000 });
 */
export function useApi(apiFunction) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction(...args);
      setData(response.data || response);
      return response;
    } catch (err) {
      const errorMessage = err?.error || err?.message || 'An unexpected error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, error, loading, execute, reset };
}

export default useApi;
