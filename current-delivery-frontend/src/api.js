import axios from 'axios';

// Relative baseURL ensures it works in both dev and prod
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});


// Add token to Authorization header if exists
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
