import axios, { AxiosInstance } from 'axios';
import { env } from '../../shared/config/env.config';
import { setupAuthInterceptor } from './interceptors/auth.interceptor';
import { setupErrorInterceptor } from './interceptors/error.interceptor';

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup interceptors
setupAuthInterceptor(apiClient);
setupErrorInterceptor(apiClient);

export default apiClient;

