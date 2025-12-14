import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IsNull } from 'typeorm';
import { TypeOrmClientRepository } from './client.repository.js';
import { ClientSchema } from '../schemas/client.schema.js';
import { Client } from '../../../../domain/entities/client.entity.js';
import type { FindAllOptions } from '@teddy-monorepo/api/core';

class MockWriteRepository {
  save = jest.fn();
  softDelete = jest.fn();
  delete = jest.fn();
  increment = jest.fn();
}

class MockReadRepository {
  findOne = jest.fn();
  find = jest.fn();
  count = jest.fn();
  createQueryBuilder = jest.fn();
}

class MockQueryBuilder {
  where = jest.fn().mockReturnThis();
  andWhere = jest.fn().mockReturnThis();
  orderBy = jest.fn().mockReturnThis();
  skip = jest.fn().mockReturnThis();
  take = jest.fn().mockReturnThis();
  select = jest.fn().mockReturnThis();
  addSelect = jest.fn().mockReturnThis();
  groupBy = jest.fn().mockReturnThis();
  withDeleted = jest.fn().mockReturnThis();
  getCount = jest.fn();
  getMany = jest.fn();
  getRawMany = jest.fn();
}

describe('TypeOrmClientRepository', () => {
  let repository: TypeOrmClientRepository;
  let writeRepo: MockWriteRepository;
  let readRepo: MockReadRepository;

  beforeEach(async () => {
    writeRepo = new MockWriteRepository();
    readRepo = new MockReadRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeOrmClientRepository,
        {
          provide: getRepositoryToken(ClientSchema, 'write'),
          useValue: writeRepo,
        },
        {
          provide: getRepositoryToken(ClientSchema, 'read'),
          useValue: readRepo,
        },
      ],
    }).compile();

    repository = module.get<TypeOrmClientRepository>(TypeOrmClientRepository);
  });

  describe('save', () => {
    it('should save a client successfully', async () => {
      const client = new Client(
        'John Doe',
        'john@example.com',
        '12345678909',
        '11987654321',
        0,
        '123',
        new Date(),
        new Date(),
        null
      );

      const schema = ClientSchema.fromDomain(client);
      writeRepo.save.mockResolvedValue(schema);

      const result = await repository.save(client);

      expect(result).toBeInstanceOf(Client);
      expect(writeRepo.save).toHaveBeenCalled();
    });
  });

  describe('softDelete', () => {
    it('should soft delete a client by ID', async () => {
      await repository.softDelete('123');

      expect(writeRepo.softDelete).toHaveBeenCalledWith('123');
    });
  });

  describe('delete', () => {
    it('should hard delete a client by ID', async () => {
      await repository.delete('123');

      expect(writeRepo.delete).toHaveBeenCalledWith('123');
    });
  });

  describe('incrementAccessCount', () => {
    it('should increment access count for a client', async () => {
      await repository.incrementAccessCount('123');

      expect(writeRepo.increment).toHaveBeenCalledWith({ id: '123' }, 'accessCount', 1);
    });
  });

  describe('findById', () => {
    it('should find a client by ID', async () => {
      const client = new Client(
        'John Doe',
        'john@example.com',
        '12345678909',
        '11987654321',
        5,
        '123',
        new Date(),
        new Date(),
        null
      );

      const schema = ClientSchema.fromDomain(client);
      readRepo.findOne.mockResolvedValue(schema);

      const result = await repository.findById('123');

      expect(result).toBeInstanceOf(Client);
      expect(result?.id).toBe('123');
      expect(readRepo.findOne).toHaveBeenCalledWith({
        where: { id: '123', deletedAt: IsNull() }
      });
    });

    it('should return null when client not found', async () => {
      readRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById('999');

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find a client by email', async () => {
      const client = new Client(
        'John Doe',
        'john@example.com',
        '12345678909',
        '11987654321',
        5,
        '123',
        new Date(),
        new Date(),
        null
      );

      const schema = ClientSchema.fromDomain(client);
      readRepo.findOne.mockResolvedValue(schema);

      const result = await repository.findByEmail('john@example.com');

      expect(result).toBeInstanceOf(Client);
      expect(result?.email).toBe('john@example.com');
      expect(readRepo.findOne).toHaveBeenCalledWith({
        where: { email: 'john@example.com', deletedAt: IsNull() }
      });
    });

    it('should return null when email not found', async () => {
      readRepo.findOne.mockResolvedValue(null);

      const result = await repository.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findByCpf', () => {
    it('should find a client by CPF', async () => {
      const client = new Client(
        'John Doe',
        'john@example.com',
        '12345678909',
        '11987654321',
        5,
        '123',
        new Date(),
        new Date(),
        null
      );

      const schema = ClientSchema.fromDomain(client);
      readRepo.findOne.mockResolvedValue(schema);

      const result = await repository.findByCpf('12345678909');

      expect(result).toBeInstanceOf(Client);
      expect(result?.cpf).toBe('12345678909');
      expect(readRepo.findOne).toHaveBeenCalledWith({
        where: { cpf: '12345678909', deletedAt: IsNull() }
      });
    });

    it('should return null when CPF not found', async () => {
      readRepo.findOne.mockResolvedValue(null);

      const result = await repository.findByCpf('99999999999');

      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    it('should find one client with custom where clause', async () => {
      const client = new Client(
        'John Doe',
        'john@example.com',
        '12345678909',
        '11987654321',
        5,
        '123',
        new Date(),
        new Date(),
        null
      );

      const schema = ClientSchema.fromDomain(client);
      readRepo.findOne.mockResolvedValue(schema);

      const result = await repository.findOne({ email: 'john@example.com' });

      expect(result).toBeInstanceOf(Client);
    });
  });

  describe('findMany', () => {
    it('should find multiple clients', async () => {
      const clients = [
        new Client('John Doe', 'john@example.com', '12345678909', '11987654321', 5, '1', new Date(), new Date(), null),
        new Client('Jane Doe', 'jane@example.com', '11144477735', '11999998888', 3, '2', new Date(), new Date(), null),
      ];

      const schemas = clients.map(c => ClientSchema.fromDomain(c));
      readRepo.find.mockResolvedValue(schemas);

      const result = await repository.findMany();

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Client);
    });
  });

  describe('findAll', () => {
    it('should find all clients with pagination', async () => {
      const qb = new MockQueryBuilder();
      readRepo.createQueryBuilder.mockReturnValue(qb);

      qb.getCount.mockResolvedValue(2);

      const clients = [
        new Client('John Doe', 'john@example.com', '12345678909', '11987654321', 5, '1', new Date(), new Date(), null),
      ];

      const schemas = clients.map(c => ClientSchema.fromDomain(c));
      qb.getMany.mockResolvedValue(schemas);

      const options: FindAllOptions = {
        page: 1,
        limit: 10,
      };

      const result = await repository.findAll(options);

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
    });

    it('should apply search filter', async () => {
      const qb = new MockQueryBuilder();
      readRepo.createQueryBuilder.mockReturnValue(qb);

      qb.getCount.mockResolvedValue(0);
      qb.getMany.mockResolvedValue([]);

      const options: FindAllOptions = {
        page: 1,
        limit: 10,
        search: 'John',
      };

      await repository.findAll(options);

      expect(qb.andWhere).toHaveBeenCalledWith(
        '(client.name ILIKE :search OR client.email ILIKE :search)',
        { search: '%John%' }
      );
    });

    it('should apply sorting', async () => {
      const qb = new MockQueryBuilder();
      readRepo.createQueryBuilder.mockReturnValue(qb);

      qb.getCount.mockResolvedValue(0);
      qb.getMany.mockResolvedValue([]);

      const options: FindAllOptions = {
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'ASC',
      };

      await repository.findAll(options);

      expect(qb.orderBy).toHaveBeenCalledWith('client.name', 'ASC');
    });
  });

  describe('countActive', () => {
    it('should count active clients', async () => {
      readRepo.count.mockResolvedValue(10);

      const result = await repository.countActive();

      expect(result).toBe(10);
      expect(readRepo.count).toHaveBeenCalledWith({
        where: { deletedAt: IsNull() }
      });
    });
  });

  describe('countDeleted', () => {
    it('should count deleted clients', async () => {
      const qb = new MockQueryBuilder();
      readRepo.createQueryBuilder.mockReturnValue(qb);

      qb.getCount.mockResolvedValue(5);

      const result = await repository.countDeleted();

      expect(result).toBe(5);
      expect(qb.withDeleted).toHaveBeenCalled();
    });
  });

  describe('countNewThisMonth', () => {
    it('should count clients created this month', async () => {
      const qb = new MockQueryBuilder();
      readRepo.createQueryBuilder.mockReturnValue(qb);

      qb.getCount.mockResolvedValue(3);

      const result = await repository.countNewThisMonth();

      expect(result).toBe(3);
    });
  });

  describe('countClientsByMonth', () => {
    it('should return clients count by month', async () => {
      const qb = new MockQueryBuilder();
      readRepo.createQueryBuilder.mockReturnValue(qb);

      const now = new Date();
      const mockData = [
        { month: new Date(now.getFullYear(), now.getMonth() - 2, 1), count: '5' },
        { month: new Date(now.getFullYear(), now.getMonth() - 1, 1), count: '10' },
        { month: new Date(now.getFullYear(), now.getMonth(), 1), count: '15' },
      ];

      qb.getRawMany.mockResolvedValue(mockData);

      const result = await repository.countClientsByMonth(3);

      expect(result).toHaveLength(3);
      expect(result[0].count).toBe(5);
      expect(result[1].count).toBe(10);
      expect(result[2].count).toBe(15);
    });

    it('should fill missing months with zero count', async () => {
      const qb = new MockQueryBuilder();
      readRepo.createQueryBuilder.mockReturnValue(qb);

      qb.getRawMany.mockResolvedValue([]);

      const result = await repository.countClientsByMonth(3);

      expect(result).toHaveLength(3);
      expect(result.every(r => r.count === 0)).toBe(true);
    });

    it('should return correct months in chronological order', async () => {
      const qb = new MockQueryBuilder();
      readRepo.createQueryBuilder.mockReturnValue(qb);

      qb.getRawMany.mockResolvedValue([]);

      const result = await repository.countClientsByMonth(3);
      const now = new Date();

      expect(result).toHaveLength(3);
      
      // Verificar que os meses são realmente os últimos 3 meses
      const expectedMonth0 = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      const expectedMonth1 = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const expectedMonth2 = new Date(now.getFullYear(), now.getMonth(), 1);

      expect(result[0].month.getFullYear()).toBe(expectedMonth0.getFullYear());
      expect(result[0].month.getMonth()).toBe(expectedMonth0.getMonth());
      
      expect(result[1].month.getFullYear()).toBe(expectedMonth1.getFullYear());
      expect(result[1].month.getMonth()).toBe(expectedMonth1.getMonth());
      
      expect(result[2].month.getFullYear()).toBe(expectedMonth2.getFullYear());
      expect(result[2].month.getMonth()).toBe(expectedMonth2.getMonth());
    });

    it('should handle year boundaries correctly', async () => {
      const qb = new MockQueryBuilder();
      readRepo.createQueryBuilder.mockReturnValue(qb);

      const now = new Date();
      // Criar 3 meses que podem atravessar ano
      const month0 = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      const month1 = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const month2 = new Date(now.getFullYear(), now.getMonth(), 1);

      const mockData = [
        { month: month0, count: '5' },
        { month: month1, count: '10' },
        { month: month2, count: '15' },
      ];

      qb.getRawMany.mockResolvedValue(mockData);

      const result = await repository.countClientsByMonth(3);

      expect(result).toHaveLength(3);
      // Verificar que os anos e meses são preservados corretamente
      expect(result[0].month.getFullYear()).toBe(month0.getFullYear());
      expect(result[0].month.getMonth()).toBe(month0.getMonth());
      expect(result[1].month.getFullYear()).toBe(month1.getFullYear());
      expect(result[1].month.getMonth()).toBe(month1.getMonth());
      expect(result[2].month.getFullYear()).toBe(month2.getFullYear());
      expect(result[2].month.getMonth()).toBe(month2.getMonth());
    });
  });
});
