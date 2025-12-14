import type { User } from '../entities/user.entity';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface ValidateTokenResponse {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
}

export interface IAuthRepository {
  login(request: LoginRequest): Promise<LoginResponse>;
  validateToken(): Promise<ValidateTokenResponse>;
}

