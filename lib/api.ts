import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import Router from 'next/router';

const honorUrl = '192.168.137.200'
const lenovoUrl = '192.168.0.241'

export const api = axios.create({
  baseURL: `http://${lenovoUrl}/api/`,
});


// Интерцептор для добавления Access Token в заголовки
api.interceptors.request.use((config) => {
  const { access } = parseCookies();
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});


// Интерцептор для обработки ошибок и обновления токена
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (!originalRequest || 
        originalRequest.url?.includes('/auth/register') || 
        originalRequest.url?.includes('/auth/token')
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      try {
        originalRequest._retry = true;
        const { refresh } = parseCookies();

        if (!refresh) throw new Error('No refresh token');

        // Используем экземпляр api для запроса
        const { data } = await api.post<{ access: string; refresh: string }>(
          '/auth/token/refresh/',
          { refresh }
        );

        setCookie(null, 'access', data.access, { maxAge: 30 * 60, path: '/' });
        setCookie(null, 'refresh', data.refresh, { maxAge: 24 * 60 * 60, path: '/' });

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${data.access}`,
        };
        return api(originalRequest);
      } catch (refreshError) {
        destroyCookie(null, 'access', { path: '/' });
        destroyCookie(null, 'refresh', { path: '/' });
        Router.push('/login');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


export const baseErrorHandler = function(error: unknown){
  if(error instanceof AxiosError)
  {
    throw new Error(error.response?.data?.detail || error.message);
  }
}