import axios from 'axios';
import { parseCookies } from 'nookies';

export const api = axios.create({
  baseURL: 'http://192.168.0.241:8000/api/',
});

api.interceptors.request.use((config) => {
  const cookies = parseCookies();
  const token = cookies.token;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});