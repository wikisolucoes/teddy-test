import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ValidateTokenHandler } from './validate-token.handler';
import { ValidateTokenQuery } from '../queries/validate-token.query';
import { UserRepository } from '../../ports/user.repository';
import { TypeOrmUserRepository } from '../../../infrastructure/persistence/typeorm/repositories/user.repository';
import { User } from '../../../domain/entities/user.entity';

jest.mock('../../../infrastructure/persistence/typeorm/repositories/user.repository');

describe('ValidateTokenHandler', () => {
  let handler: ValidateTokenHandler;
  let repository: jest.Mocked<TypeOrmUserRepository>;
  let module: TestingModule;

  beforeEach(async () => {
    jest.clearAllMocks();

    module = await Test.createTestingModule({
      providers: [
        ValidateTokenHandler,
        {
          provide: UserRepository,
          useClass: TypeOrmUserRepository,
        },
      ],
    }).compile();

    handler = module.get<ValidateTokenHandler>(ValidateTokenHandler);
    repository = module.get(UserRepository);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('execute', () => {
    it('should validate token and return user data successfully', async () => {
      // Arrange
      const query = new ValidateTokenQuery('user-uuid-123');

      const user = new User(
        'John Doe',
        'john@example.com',
        'hashed-password',
        true,
        'user-uuid-123',
        new Date(),
        new Date()
      );

      repository.findById.mockResolvedValue(user);

      // Act
      const result = await handler.execute(query);

      // Assert
      expect(result).toEqual({
        id: 'user-uuid-123',
        name: 'John Doe',
        email: 'john@example.com',
        isActive: true,
      });

      expect(repository.findById).toHaveBeenCalledWith('user-uuid-123');
      expect(repository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when user not found', async () => {
      // Arrange
      const query = new ValidateTokenQuery('nonexistent-uuid');
      repository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(handler.execute(query)).rejects.toThrow(NotFoundException);
      await expect(handler.execute(query)).rejects.toThrow('User not found or inactive');

      expect(repository.findById).toHaveBeenCalledWith('nonexistent-uuid');
    });

    it('should throw NotFoundException when user is inactive', async () => {
      // Arrange
      const query = new ValidateTokenQuery('inactive-user-uuid');

      const inactiveUser = new User(
        'Inactive User',
        'inactive@example.com',
        'hashed-password',
        false, // isActive = false
        'inactive-user-uuid',
        new Date(),
        new Date(),
        null
      );

      repository.findById.mockResolvedValue(inactiveUser);

      // Act & Assert
      await expect(handler.execute(query)).rejects.toThrow(NotFoundException);
      await expect(handler.execute(query)).rejects.toThrow('User not found or inactive');

      expect(repository.findById).toHaveBeenCalledWith('inactive-user-uuid');
    });

    it('should only call repository once per execution', async () => {
      // Arrange
      const query = new ValidateTokenQuery('user-uuid-123');

      const user = new User(
        'John Doe',
        'john@example.com',
        'hashed-password',
        true,
        'user-uuid-123',
        new Date(),
        new Date(),
        null
      );

      repository.findById.mockResolvedValue(user);

      // Act
      await handler.execute(query);

      // Assert
      expect(repository.findById).toHaveBeenCalledTimes(1);
    });

    it('should not expose password in response', async () => {
      // Arrange
      const query = new ValidateTokenQuery('user-uuid-123');

      const user = new User(
        'John Doe',
        'john@example.com',
        'super-secret-hashed-password',
        true,
        'user-uuid-123',
        new Date(),
        new Date(),
        null
      );

      repository.findById.mockResolvedValue(user);

      // Act
      const result = await handler.execute(query);

      // Assert
      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('isActive');
    });
  });
});
