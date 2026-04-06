import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Reference to toast function (set by ToastContext)
let showToastFn = null;

export const setToastFunction = (fn) => {
  showToastFn = fn;
};

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Enhanced error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (showToastFn) {
        showToastFn('Session expired. Please login again.', 'error');
      }
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // 403 Forbidden - insufficient permissions
    if (error.response?.status === 403) {
      if (showToastFn) {
        showToastFn('You don\'t have permission to perform this action.', 'error');
      }
      return Promise.reject(error);
    }

    // 5xx Server errors
    if (error.response?.status >= 500) {
      if (showToastFn) {
        showToastFn('Server error. Please try again later.', 'error');
      }
      return Promise.reject(error);
    }

    // Network errors (no response from server)
    if (!error.response) {
      if (showToastFn) {
        showToastFn('Network error. Please check your connection.', 'error');
      }
      return Promise.reject(error);
    }

    // For all other errors, let the component handle them
    return Promise.reject(error);
  }
);

export default api;