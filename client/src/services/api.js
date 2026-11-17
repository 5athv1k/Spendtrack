import axios from 'axios';

/**
 * Axios instance configured with base URL
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor:
 * Attaches the JSON Web Token (JWT) from localStorage to the Authorization header
 * of every outgoing HTTP request if the user is authenticated.
 */
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

/**
 * Response Interceptor:
 * Catches 401 Unauthorized responses (e.g. expired or tampered token).
 * Automatically clears local credentials when an unauthorized error occurs.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, clear cached token & user
      // Avoid redirect loops if already on auth routes
      const isAuthRoute =
        window.location.pathname === '/login' ||
        window.location.pathname === '/register';

      if (!isAuthRoute && localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
