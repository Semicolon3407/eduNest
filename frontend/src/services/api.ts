import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the Bearer token if present
api.interceptors.request.use((config) => {
  // Cookies are handled automatically by withCredentials: true
  // But if you use local storage for token, you can add it here.
  return config;
});

export default api;
