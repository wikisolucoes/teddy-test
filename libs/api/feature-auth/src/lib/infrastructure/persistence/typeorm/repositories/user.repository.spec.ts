import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmUserRepository } from './user.repository';
import { UserRepository } from '../../../../application/ports/user.repository';
import { UserSchema } from '../schemas/user.schema';
import { User } from '../../../../domain/entities/user.entity';

class MockWriteRepository {
  save = jest.fn();
  delete = jest.fn();
  softDelete = jest.fn();
}

class MockReadRepository {
  findOne = jest.fn();
  find = jest.fn();
}

describe('TypeOrmUserRepository', () => {
  let repository: TypeOrmUserRepository;
  let writeRepo: MockWriteRepository;
  let readRepo: MockReadRepository;
  let module: TestingModule;

  beforeEach(async () => {
    jest.clearAllMocks();

    module = await Test.createTestingModule({
      providers: [
        {
          provide: UserRepository,
          useClass: TypeOrmUserRepository,
        },
        {
          provide: getRepositoryToken(UserSchema, 'write'),
          useClass: MockWriteRepository,
        },
        {
          provide: getRepositoryToken(UserSchema, 'read'),
          useClass: MockReadRepository,
        },
      ],
    }).compile();

    repository = module.get<TypeOrmUserRepository>(UserRepository);
    writeRepo = module.get(getRepositoryToken(UserSchema, 'write'));
    readRepo = module.get(getRepositoryToken(UserSchema, 'read'));
  });

  afterEach(async () => {
    await module.close();
  });

  describe('findByEmail', () => {
    it('should find user by email using read repository', async () => {
      // Arrange
      const email = 'john@example.com';
      const schema = new UserSchema();
      schema.id = 'user-uuid-123';
      schema.name = 'John Doe';
      schema.email = email;
      schema.password = 'hashed-password';
      schema.isActive = true;
      schema.createdAt = new Date();
      schema.updatedAt = new Date();
      schema.deletedAt = null;

      readRepo.findOne.mockResolvedValue(schema);

      // Act
      const result = await repository.findByEmail(email);

      // Assert
      expect(result).toBeInstanceOf(User);
      expect(result?.email).toBe(email);
      expect(result?.name).toBe('John Doe');
      expect(readRepo.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(readRepo.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return null when user not found', async () => {
      // Arrange
      const email = 'notfound@example.com';
      readRepo.findOne.mockResolvedValue(null);

      // Act
      const result = await repository.findByEmail(email);

      // Assert
      expect(result).toBeNull();
      expect(readRepo.findOne).toHaveBeenCalledWith({ where: { email } });
    });
  });

  describe('findById', () => {
    it('should find user by id using read repository', async () => {
      // Arrange
      const id = 'user-uuid-123';
      const schema = new UserSchema();
      schema.id = id;
      schema.name = 'John Doe';
      schema.email = 'john@example.com';
      schema.password = 'hashed-password';
      schema.isActive = true;
      schema.createdAt = new Date();
      schema.updatedAt = new Date();
      schema.deletedAt = null;

      readRepo.findOne.mockResolvedValue(schema);

      // Act
      const result = await repository.findById(id);

      // Assert
      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe(id);
      expect(readRepo.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(readRepo.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return null when user not found by id', async () => {
      // Arrange
      const id = 'nonexistent-uuid';
      readRepo.findOne.mockResolvedValue(null);

      // Act
      const result = await repository.findById(id);

      // Assert
      expect(result).toBeNull();
      expect(readRepo.findOne).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('save', () => {
    it('should save user using write repository', async () => {
      // Arrange
      const user = new User(
        'Jane Doe',
        'jane@example.com',
        'hashed-password',
        true,
        'user-uuid-456'
      );

      const savedSchema = new UserSchema();
      savedSchema.id = user.id;
      savedSchema.name = user.name;
      savedSchema.email = user.email;
      savedSchema.password = user.password;
      savedSchema.isActive = user.isActive;
      savedSchema.createdAt = new Date();
      savedSchema.updatedAt = new Date();
      savedSchema.deletedAt = null;

      writeRepo.save.mockResolvedValue(savedSchema);

      // Act
      const result = await repository.save(user);

      // Assert
      expect(result).toBeInstanceOf(User);
      expect(result.email).toBe('jane@example.com');
      expect(result.name).toBe('Jane Doe');
      expect(writeRepo.save).toHaveBeenCalledTimes(1);
      expect(writeRepo.save).toHaveBeenCalledWith(expect.any(UserSchema));
    });

    it('should convert User entity to UserSchema before saving', async () => {
      // Arrange
      const user = new User(
        'Test User',
        'test@example.com',
        'password',
        true
      );

      const savedSchema = new UserSchema();
      savedSchema.id = 'new-uuid';
      savedSchema.name = user.name;
      savedSchema.email = user.email;
      savedSchema.password = user.password;
      savedSchema.isActive = user.isActive;
      savedSchema.createdAt = new Date();
      savedSchema.updatedAt = new Date();
      savedSchema.deletedAt = null;

      writeRepo.save.mockResolvedValue(savedSchema);

      // Act
      await repository.save(user);

      // Assert
      const savedArg = writeRepo.save.mock.calls[0][0];
      expect(savedArg).toBeInstanceOf(UserSchema);
    });
  });

  describe('delete', () => {
    it('should hard delete user using write repository', async () => {
      // Arrange
      const id = 'user-uuid-123';
      writeRepo.delete.mockResolvedValue({ affected: 1, raw: {} });

      // Act
      await repository.delete(id);

      // Assert
      expect(writeRepo.delete).toHaveBeenCalledWith(id);
      expect(writeRepo.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('softDelete', () => {
    it('should soft delete user using write repository', async () => {
      // Arrange
      const id = 'user-uuid-123';
      writeRepo.softDelete.mockResolvedValue({ affected: 1, raw: {}, generatedMaps: [] });

      // Act
      await repository.softDelete(id);

      // Assert
      expect(writeRepo.softDelete).toHaveBeenCalledWith(id);
      expect(writeRepo.softDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should find user with custom where conditions using read repository', async () => {
      // Arrange
      const where = { email: 'john@example.com', isActive: true };
      const schema = new UserSchema();
      schema.id = 'user-uuid-123';
      schema.name = 'John Doe';
      schema.email = 'john@example.com';
      schema.password = 'hashed-password';
      schema.isActive = true;
      schema.createdAt = new Date();
      schema.updatedAt = new Date();
      schema.deletedAt = null;

      readRepo.findOne.mockResolvedValue(schema);

      // Act
      const result = await repository.findOne(where);

      // Assert
      expect(result).toBeInstanceOf(User);
      expect(result?.email).toBe('john@example.com');
      expect(readRepo.findOne).toHaveBeenCalledWith({ where });
    });

    it('should return null when no user matches conditions', async () => {
      // Arrange
      const where = { email: 'notfound@example.com' };
      readRepo.findOne.mockResolvedValue(null);

      // Act
      const result = await repository.findOne(where);

      // Assert
      expect(result).toBeNull();
      expect(readRepo.findOne).toHaveBeenCalledWith({ where });
    });
  });

  describe('findMany', () => {
    it('should find multiple users using read repository', async () => {
      // Arrange
      const schema1 = new UserSchema();
      schema1.id = 'user-1';
      schema1.name = 'User 1';
      schema1.email = 'user1@example.com';
      schema1.password = 'password';
      schema1.isActive = true;
      schema1.createdAt = new Date();
      schema1.updatedAt = new Date();
      schema1.deletedAt = null;

      const schema2 = new UserSchema();
      schema2.id = 'user-2';
      schema2.name = 'User 2';
      schema2.email = 'user2@example.com';
      schema2.password = 'password';
      schema2.isActive = true;
      schema2.createdAt = new Date();
      schema2.updatedAt = new Date();
      schema2.deletedAt = null;

      readRepo.find.mockResolvedValue([schema1, schema2]);

      // Act
      const result = await repository.findMany();

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(User);
      expect(result[1]).toBeInstanceOf(User);
      expect(result[0].name).toBe('User 1');
      expect(result[1].name).toBe('User 2');
      expect(readRepo.find).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no users found', async () => {
      // Arrange
      readRepo.find.mockResolvedValue([]);

      // Act
      const result = await repository.findMany();

      // Assert
      expect(result).toEqual([]);
      expect(readRepo.find).toHaveBeenCalledTimes(1);
    });
  });
});
