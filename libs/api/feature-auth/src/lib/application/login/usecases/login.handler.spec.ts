import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginHandler } from './login.handler';
import { LoginCommand } from '../commands/login.command';
import { UserRepository } from '../../ports/user.repository';
import { TypeOrmUserRepository } from '../../../infrastructure/persistence/typeorm/repositories/user.repository';
import { User } from '../../../domain/entities/user.entity';
import { PrometheusService } from '@teddy-monorepo/api/core';

jest.mock('../../../infrastructure/persistence/typeorm/repositories/user.repository');
jest.mock('@nestjs/jwt');
jest.mock('@nestjs/config');

class MockLogger {
  info = jest.fn();
  error = jest.fn();
  warn = jest.fn();
  debug = jest.fn();
}

class MockPrometheusService {
  incrementAuthAttempts = jest.fn();
  recordHttpRequest = jest.fn();
  recordDbQuery = jest.fn();
  setDbConnections = jest.fn();
  setClientsTotal = jest.fn();
}

describe('LoginHandler', () => {
  let handler: LoginHandler;
  let repository: jest.Mocked<TypeOrmUserRepository>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;
  let prometheusService: jest.Mocked<PrometheusService>;
  let logger: MockLogger;
  let module: TestingModule;

  beforeEach(async () => {
    jest.clearAllMocks();

    module = await Test.createTestingModule({
      providers: [
        LoginHandler,
        {
          provide: UserRepository,
          useClass: TypeOrmUserRepository,
        },
        {
          provide: JwtService,
          useClass: JwtService,
        },
        {
          provide: ConfigService,
          useClass: ConfigService,
        },
        {
          provide: PrometheusService,
          useClass: MockPrometheusService,
        },
        {
          provide: 'winston',
          useClass: MockLogger,
        },
      ],
    }).compile();

    handler = module.get<LoginHandler>(LoginHandler);
    repository = module.get(UserRepository);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
    prometheusService = module.get(PrometheusService);
    logger = module.get('winston');
  });

  afterEach(async () => {
    await module.close();
  });

  describe('execute', () => {
    it('should login successfully with valid credentials', async () => {
      // Arrange
      const command = new LoginCommand('john@example.com', 'password123');
      const hashedPassword = await bcrypt.hash('password123', 10);

      const user = new User(
        'John Doe',
        'john@example.com',
        hashedPassword,
        true,
        'user-uuid-123',
        new Date(),
        new Date(),
        null
      );

      repository.findByEmail.mockResolvedValue(user);
      jwtService.sign.mockReturnValue('jwt-token-xyz');
      configService.get.mockReturnValue('24h');

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result).toEqual({
        access_token: 'jwt-token-xyz',
        token_type: 'Bearer',
        expires_in: '24h',
        user: {
          id: 'user-uuid-123',
          name: 'John Doe',
          email: 'john@example.com',
        },
      });

      expect(repository.findByEmail).toHaveBeenCalledWith('john@example.com');
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'user-uuid-123',
        email: 'john@example.com',
      });
      expect(prometheusService.incrementAuthAttempts).toHaveBeenCalledWith('success');
      expect(logger.info).toHaveBeenCalledWith('User logged in successfully', {
        userId: 'user-uuid-123',
        email: 'john@example.com',
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      // Arrange
      const command = new LoginCommand('notfound@example.com', 'password123');
      repository.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow(UnauthorizedException);
      await expect(handler.execute(command)).rejects.toThrow('Invalid credentials');

      expect(repository.findByEmail).toHaveBeenCalledWith('notfound@example.com');
      expect(prometheusService.incrementAuthAttempts).toHaveBeenCalledWith('failed');
      expect(logger.warn).toHaveBeenCalledWith('Login attempt failed', {
        email: 'notfound@example.com',
      });
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user is inactive', async () => {
      // Arrange
      const command = new LoginCommand('inactive@example.com', 'password123');
      const hashedPassword = await bcrypt.hash('password123', 10);

      const inactiveUser = new User(
        'Inactive User',
        'inactive@example.com',
        hashedPassword,
        false, // isActive = false
        'user-uuid-456',
        new Date(),
        new Date(),
        null
      );

      repository.findByEmail.mockResolvedValue(inactiveUser);

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow(UnauthorizedException);
      await expect(handler.execute(command)).rejects.toThrow('Invalid credentials');

      expect(repository.findByEmail).toHaveBeenCalledWith('inactive@example.com');
      expect(prometheusService.incrementAuthAttempts).toHaveBeenCalledWith('failed');
      expect(logger.warn).toHaveBeenCalledWith('Login attempt failed', {
        email: 'inactive@example.com',
      });
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      // Arrange
      const command = new LoginCommand('john@example.com', 'wrongpassword');
      const hashedPassword = await bcrypt.hash('correctpassword', 10);

      const user = new User(
        'John Doe',
        'john@example.com',
        hashedPassword,
        true,
        'user-uuid-123',
        new Date(),
        new Date(),
        null
      );

      repository.findByEmail.mockResolvedValue(user);

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow(UnauthorizedException);
      await expect(handler.execute(command)).rejects.toThrow('Invalid credentials');

      expect(repository.findByEmail).toHaveBeenCalledWith('john@example.com');
      expect(prometheusService.incrementAuthAttempts).toHaveBeenCalledWith('failed');
      expect(logger.warn).toHaveBeenCalledWith('Login attempt failed - wrong password', {
        email: 'john@example.com',
      });
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should validate and normalize email using Email value object', async () => {
      // Arrange
      const command = new LoginCommand('  john@example.com  ', 'password123');
      const hashedPassword = await bcrypt.hash('password123', 10);

      const user = new User(
        'John Doe',
        'john@example.com', // Email normalizado
        hashedPassword,
        true,
        'user-uuid-123',
        new Date(),
        new Date(),
        null
      );

      repository.findByEmail.mockResolvedValue(user);
      jwtService.sign.mockReturnValue('jwt-token-xyz');
      configService.get.mockReturnValue('24h');

      // Act
      const result = await handler.execute(command);

      // Assert
      // Email VO normaliza para lowercase e trim
      expect(repository.findByEmail).toHaveBeenCalledWith('john@example.com');
      expect(result.user.email).toBe('john@example.com');
    });

    it('should throw error for invalid email format', async () => {
      // Arrange
      const command = new LoginCommand('invalid-email', 'password123');

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow('Invalid email format');

      expect(repository.findByEmail).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });
});
