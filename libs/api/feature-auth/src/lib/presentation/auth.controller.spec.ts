import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../application/services/auth.service';
import type { LoginDto } from '../application/login/dtos/login.dto';
import type { AuthResponseDto } from '../application/shared/dtos/auth-response.dto';

jest.mock('../application/services/auth.service');

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let module: TestingModule;

  beforeEach(async () => {
    jest.clearAllMocks();

    module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useClass: AuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('login', () => {
    it('should login successfully and return auth response', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      const expectedResponse: AuthResponseDto = {
        access_token: 'jwt-token-xyz',
        token_type: 'Bearer',
        expires_in: '24h',
        user: {
          id: 'user-uuid-123',
          name: 'John Doe',
          email: 'john@example.com',
        },
      };

      authService.login.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.login(loginDto);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(authService.login).toHaveBeenCalledTimes(1);
    });

    it('should pass login dto to auth service', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'testpassword',
      };

      const mockResponse: AuthResponseDto = {
        access_token: 'token',
        token_type: 'Bearer',
        expires_in: '1h',
        user: {
          id: 'id',
          name: 'Test User',
          email: 'test@example.com',
        },
      };

      authService.login.mockResolvedValue(mockResponse);

      // Act
      await controller.login(loginDto);

      // Assert
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'testpassword',
      });
    });

    it('should propagate errors from auth service', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      };

      const error = new Error('Invalid credentials');
      authService.login.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.login(loginDto)).rejects.toThrow('Invalid credentials');
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user data', async () => {
      // Arrange
      const userId = 'user-uuid-123';
      const expectedUser = {
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        isActive: true,
      };

      authService.validateToken.mockResolvedValue(expectedUser);

      // Act
      const result = await controller.getCurrentUser(userId);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(authService.validateToken).toHaveBeenCalledWith(userId);
      expect(authService.validateToken).toHaveBeenCalledTimes(1);
    });

    it('should call validateToken with correct userId', async () => {
      // Arrange
      const userId = 'test-user-id';
      const mockUser = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        isActive: true,
      };

      authService.validateToken.mockResolvedValue(mockUser);

      // Act
      await controller.getCurrentUser(userId);

      // Assert
      expect(authService.validateToken).toHaveBeenCalledWith('test-user-id');
    });

    it('should propagate errors when user not found', async () => {
      // Arrange
      const userId = 'nonexistent-id';
      const error = new Error('User not found or inactive');
      authService.validateToken.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.getCurrentUser(userId)).rejects.toThrow('User not found or inactive');
      expect(authService.validateToken).toHaveBeenCalledWith(userId);
    });
  });
});
