import { api } from "../api";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import Router from 'next/router';
import { UserData } from "@/lib/models"
import { baseErrorHandler } from "../api";


export const authService = {
    async login(username: string, password: string) {
      try{
      const response = await api.post('auth/token/', { username, password });
      
      // Безопасные настройки куки
      const cookieOptions = {
        path: '/',
      };
  
      setCookie(null, 'access', response.data.access, {
        ...cookieOptions,
        maxAge: 30 * 60, // 30 мин
      });
  
      setCookie(null, 'refresh', response.data.refresh, {
        ...cookieOptions,
        maxAge: 24 * 60 * 60, // 1 день
      });
  
      return response.data;
     } catch (error) {
        baseErrorHandler(error);
      }
    },
  
    async logout() {
      try {
        const { refresh } = parseCookies();
        if (refresh) {
          await api.post('auth/logout/', { refresh });
        }
      } finally {
        destroyCookie(null, 'access', { path: '/' });
        destroyCookie(null, 'refresh', { path: '/' });
        Router.push('/login');
      }
    },
  
    async register(username: string, email: string, password: string) {
      try {
        const response = await api.post('auth/register/', { username, email, password });
        return response.data;
      } catch (error) {
        baseErrorHandler(error);
      }
    },
  
    async getMe(): Promise<AxiosResponse<UserData>> {
      return api.get('/auth/me/');
    },
  };