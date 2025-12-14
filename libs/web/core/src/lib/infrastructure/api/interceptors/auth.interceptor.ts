import { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from '../../storage/token.storage';

export function setupAuthInterceptor(apiClient: AxiosInstance): void {
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = tokenStorage.get();
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

