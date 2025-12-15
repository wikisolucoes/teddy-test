import { AxiosInstance, AxiosError } from 'axios';
import { tokenStorage } from '../../storage/token.storage';

export function setupErrorInterceptor(apiClient: AxiosInstance): void {
  apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        tokenStorage.remove();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }

      return Promise.reject(error);
    }
  );
}

