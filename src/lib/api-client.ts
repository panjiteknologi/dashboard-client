import { env } from '@/env';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { getSession, signOut } from 'next-auth/react';

// Create base axios instance
const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_ENDPOINT_URL || 'https://erp.tsicertification.com',
  headers: {
    'Content-Type': 'application/json'
    // "x-vercel-protection": "secret-kode-tsi-2026",
  }
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.user?.access_token) {
      config.headers.Authorization = `Bearer ${session.user.access_token}`;
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (typeof window !== 'undefined') {
        await signOut({ callbackUrl: '/login' });
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
