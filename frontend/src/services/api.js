// ============================================================
// ARTH Frontend — API Service
// Centralized Axios instance for all backend API calls.
// ============================================================

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create Axios instance with defaults
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('arth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle auth errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('arth_token');
      localStorage.removeItem('arth_user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || { error: 'Network error' });
  }
);

// ---- Auth API ----
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// ---- User API ----
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
};

// ---- Transaction API ----
export const transactionAPI = {
  create: (data) => api.post('/transactions', data),
  getAll: (params) => api.get('/transactions', { params }),
  getSummary: () => api.get('/transactions/summary'),
};

// ---- Simulation API ----
export const simulationAPI = {
  predict: (data) => api.post('/simulation/predict', data),
};

// ---- Credit API ----
export const creditAPI = {
  getScore: (data) => api.post('/credit/score', data),
  getExplanation: (data) => api.post('/credit/explain', data),
};

// ---- Fraud API ----
export const fraudAPI = {
  detect: (data) => api.post('/fraud/detect', data),
};

// ---- Health API ----
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
