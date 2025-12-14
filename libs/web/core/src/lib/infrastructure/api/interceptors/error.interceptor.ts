import { AxiosInstance, AxiosError } from 'axios';
import { tokenStorage } from '../../storage/token.storage';

export function setupErrorInterceptor(apiClient: AxiosInstance): void {
  apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // Handle 401 Unauthorized - logout user
      if (error.response?.status === 401) {
        tokenStorage.remove();
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }

      return Promise.reject(error);
    }
  );
}

