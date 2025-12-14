import { Test, TestingModule } from '@nestjs/testing';
import { ListClientsHandler } from './list-clients.handler.js';
import { ListClientsQuery } from '../queries/list-clients.query.js';
import { ClientRepository } from '../../ports/client.repository.js';
import { Client } from '../../../domain/entities/client.entity.js';
import type { FindAllOptions, PaginatedResult } from '@teddy-monorepo/api/core';

class MockClientRepository {
  findAll = jest.fn();
}

jest.mock('../../ports/client.repository');

describe('ListClientsHandler', () => {
  let handler: ListClientsHandler;
  let clientRepository: jest.Mocked<ClientRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListClientsHandler,
        {
          provide: ClientRepository,
          useClass: MockClientRepository,
        },
      ],
    }).compile();

    handler = module.get<ListClientsHandler>(ListClientsHandler);
    clientRepository = module.get(ClientRepository);
  });

  it('should list clients with default pagination', async () => {
    const clients = [
      new Client(
        'John Doe',
        'john@example.com',
        '12345678909',
        '11987654321',
        5,
        '1',
        new Date('2024-01-01'),
        new Date('2024-01-01'),
        null
      ),
      new Client(
        'Jane Doe',
        'jane@example.com',
        '11144477735',
        '11999998888',
        3,
        '2',
        new Date('2024-01-02'),
        new Date('2024-01-02'),
        null
      ),
    ];

    const options: FindAllOptions = {
      page: 1,
      limit: 10,
    };

    const repositoryResult: PaginatedResult<Client> = {
      items: clients,
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    clientRepository.findAll.mockResolvedValue(repositoryResult);

    const query = new ListClientsQuery(options);
    const result = await handler.execute(query);

    expect(result).toEqual({
      items: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          cpf: '123.456.789-09',
          phone: '(11) 98765-4321',
          accessCount: 5,
          createdAt: clients[0].createdAt,
          updatedAt: clients[0].updatedAt,
        },
        {
          id: '2',
          name: 'Jane Doe',
          email: 'jane@example.com',
          cpf: '111.444.777-35',
          phone: '(11) 99999-8888',
          accessCount: 3,
          createdAt: clients[1].createdAt,
          updatedAt: clients[1].updatedAt,
        },
      ],
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    });

    expect(clientRepository.findAll).toHaveBeenCalledWith(options);
  });

  it('should list clients with search filter', async () => {
    const clients = [
      new Client(
        'John Doe',
        'john@example.com',
        '12345678909',
        '11987654321',
        5,
        '1',
        new Date(),
        new Date(),
        null
      ),
    ];

    const options: FindAllOptions = {
      page: 1,
      limit: 10,
      search: 'John',
    };

    const repositoryResult: PaginatedResult<Client> = {
      items: clients,
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    clientRepository.findAll.mockResolvedValue(repositoryResult);

    const query = new ListClientsQuery(options);
    await handler.execute(query);

    expect(clientRepository.findAll).toHaveBeenCalledWith(options);
  });

  it('should list clients with sorting', async () => {
    const clients = [
      new Client(
        'Alice',
        'alice@example.com',
        '12345678909',
        '11987654321',
        1,
        '1',
        new Date(),
        new Date(),
        null
      ),
      new Client(
        'Bob',
        'bob@example.com',
        '11144477735',
        '11999998888',
        2,
        '2',
        new Date(),
        new Date(),
        null
      ),
    ];

    const options: FindAllOptions = {
      page: 1,
      limit: 10,
      sortBy: 'name',
      sortOrder: 'ASC',
    };

    const repositoryResult: PaginatedResult<Client> = {
      items: clients,
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    clientRepository.findAll.mockResolvedValue(repositoryResult);

    const query = new ListClientsQuery(options);
    await handler.execute(query);

    expect(clientRepository.findAll).toHaveBeenCalledWith(options);
  });

  it('should return empty list when no clients found', async () => {
    const options: FindAllOptions = {
      page: 1,
      limit: 10,
    };

    const repositoryResult: PaginatedResult<Client> = {
      items: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };

    clientRepository.findAll.mockResolvedValue(repositoryResult);

    const query = new ListClientsQuery(options);
    const result = await handler.execute(query);

    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('should format CPF and phone for all clients', async () => {
    const clients = [
      new Client(
        'John Doe',
        'john@example.com',
        '12345678909',
        '11987654321',
        5,
        '1',
        new Date(),
        new Date(),
        null
      ),
    ];

    const options: FindAllOptions = {
      page: 1,
      limit: 10,
    };

    const repositoryResult: PaginatedResult<Client> = {
      items: clients,
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    clientRepository.findAll.mockResolvedValue(repositoryResult);

    const query = new ListClientsQuery(options);
    const result = await handler.execute(query);

    expect(result.items[0].cpf).toBe('123.456.789-09');
    expect(result.items[0].phone).toBe('(11) 98765-4321');
  });

  it('should handle pagination correctly', async () => {
    const clients = [
      new Client(
        'John Doe',
        'john@example.com',
        '12345678909',
        '11987654321',
        5,
        '11',
        new Date(),
        new Date(),
        null
      ),
    ];

    const options: FindAllOptions = {
      page: 2,
      limit: 10,
    };

    const repositoryResult: PaginatedResult<Client> = {
      items: clients,
      total: 15,
      page: 2,
      limit: 10,
      totalPages: 2,
    };

    clientRepository.findAll.mockResolvedValue(repositoryResult);

    const query = new ListClientsQuery(options);
    const result = await handler.execute(query);

    expect(result.page).toBe(2);
    expect(result.limit).toBe(10);
    expect(result.total).toBe(15);
    expect(result.totalPages).toBe(2);
  });

  it('should preserve all pagination metadata', async () => {
    const options: FindAllOptions = {
      page: 3,
      limit: 5,
    };

    const repositoryResult: PaginatedResult<Client> = {
      items: [],
      total: 20,
      page: 3,
      limit: 5,
      totalPages: 4,
    };

    clientRepository.findAll.mockResolvedValue(repositoryResult);

    const query = new ListClientsQuery(options);
    const result = await handler.execute(query);

    expect(result.page).toBe(3);
    expect(result.limit).toBe(5);
    expect(result.total).toBe(20);
    expect(result.totalPages).toBe(4);
  });

  it('should pass all options to repository', async () => {
    const options: FindAllOptions = {
      page: 2,
      limit: 20,
      search: 'test',
      sortBy: 'email',
      sortOrder: 'DESC',
    };

    const repositoryResult: PaginatedResult<Client> = {
      items: [],
      total: 0,
      page: 2,
      limit: 20,
      totalPages: 0,
    };

    clientRepository.findAll.mockResolvedValue(repositoryResult);

    const query = new ListClientsQuery(options);
    await handler.execute(query);

    expect(clientRepository.findAll).toHaveBeenCalledWith(options);
  });
});
