import { tokenStorage } from '@teddy-monorepo/web/core';
import type { IAuthRepository, LoginRequest } from '../../domain/repositories/auth.repository.interface';
import type { AuthResponse } from '../dtos/auth.dto';

export class AuthService {
  constructor(private readonly authRepository: IAuthRepository) {}

  async login(request: LoginRequest): Promise<AuthResponse> {
    const response = await this.authRepository.login(request);
    
    tokenStorage.set(response.access_token);

    return {
      accessToken: response.access_token,
      user: response.user,
    };
  }

  async logout(): Promise<void> {
    tokenStorage.remove();
  }

  async validateToken(): Promise<{ id: string; email: string; name: string } | null> {
    try {
      const response = await this.authRepository.validateToken();
      return {
        id: response.id,
        email: response.email,
        name: response.name,
      };
    } catch (error) {
      tokenStorage.remove();
      return null;
    }
  }

  isAuthenticated(): boolean {
    return tokenStorage.get() !== null;
  }
}

