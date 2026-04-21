import axios from 'axios';

export const axiosApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Request Interceptor: add the JWT token from localStorage
axiosApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@i9:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: handle 401 Unauthorized
axiosApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear storage and redirect to login
      localStorage.removeItem('@i9:token');
      localStorage.removeItem('@i9:user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);