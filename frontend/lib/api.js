// lib/api.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    const token = data.token || data.user?.token;
    if (token) {
      localStorage.setItem('token', token);
    }
    return data;
  },

  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    const token = data.token || data.user?.token;
    if (token) {
      localStorage.setItem('token', token);
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
};

export const walletAPI = {
  getWallet: async () => {
    const { data } = await api.get('/api/wallet/');
    return data;
  },

  deposit: async (amount) => {
    const { data } = await api.post('/api/wallet/deposit', { amount });
    return data;
  },

  withdraw: async (amount) => {
    const { data } = await api.post('/api/wallet/withdraw', { amount });
    return data;
  },

  getHoldings: async () => {
    const { data } = await api.get('/api/wallet/holdings');
    return data;
  },

  getPerformance: async () => {
    const { data } = await api.get('/api/wallet/performance');
    return data;
  },

  getTransactions: async (params = {}) => {
    const { data } = await api.get('/api/wallet/transactions', { params });
    return data;
  },
};

export const tradeAPI = {
  buy: async (crypto, amountUSD) => {
    const { data } = await api.post('/api/trade/buy', { crypto, amountUSD });
    return data;
  },

  sell: async (crypto, amountCrypto) => {
    const { data } = await api.post('/api/trade/sell', { crypto, amountCrypto });
    return data;
  },

  getHistory: async (params = {}) => {
    const { data } = await api.get('/api/trade/history', { params });
    return data;
  },
};

export default api;

export const marketAPI = {
  getPrices: async (symbols = []) => {
    const params = symbols.length ? { symbols: symbols.join(',') } : {};
    const { data } = await api.get('/api/market/prices', { params });
    return data;
  },

  getHistory: async (symbol, days = 7) => {
    const { data } = await api.get(`/api/market/history/${symbol}`, { params: { days } });
    return data;
  },
};
