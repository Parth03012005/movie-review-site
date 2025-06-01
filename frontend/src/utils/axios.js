// src/utils/axios.js
import axios from 'axios';
import { getToken, removeToken } from './auth';

const api = axios.create({
  baseURL: 'https://movie-review-backend-yq37.onrender.com/api',
});


// Attach token to every request
api.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Handle 401 globally (token invalid/expired)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
