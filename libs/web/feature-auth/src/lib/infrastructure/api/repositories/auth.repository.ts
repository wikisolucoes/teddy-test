import { apiClient, API_ENDPOINTS } from '@teddy-monorepo/web/core';
import type {
  IAuthRepository,
  LoginRequest,
  LoginResponse,
  ValidateTokenResponse,
} from '../../domain/repositories/auth.repository.interface';

export class AuthRepository implements IAuthRepository {
  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      request
    );
    return response.data;
  }

  async validateToken(): Promise<ValidateTokenResponse> {
    const response = await apiClient.get<ValidateTokenResponse>(
      API_ENDPOINTS.AUTH.VALIDATE
    );
    return response.data;
  }
}

