import { Test, TestingModule } from '@nestjs/testing';
import { GetLatestClientsHandler } from './get-latest-clients.handler.js';
import { GetLatestClientsQuery } from '../queries/get-latest-clients.query.js';
import { ClientRepository } from '@teddy-monorepo/api/feature-clients';
import type { PaginatedResult } from '@teddy-monorepo/api/core';

class MockClientRepository {
  findAll = jest.fn();
}

jest.mock('@teddy-monorepo/api/feature-clients');

describe('GetLatestClientsHandler', () => {
  let handler: GetLatestClientsHandler;
  let clientRepository: jest.Mocked<ClientRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetLatestClientsHandler,
        {
          provide: ClientRepository,
          useClass: MockClientRepository,
        },
      ],
    }).compile();

    handler = module.get<GetLatestClientsHandler>(GetLatestClientsHandler);
    clientRepository = module.get(ClientRepository);
  });

  it('should return latest clients successfully', async () => {
    const query = new GetLatestClientsQuery(5);

    const mockClients = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        cpf: '12345678909',
        phone: '11987654321',
        accessCount: 5,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      },
      {
        id: '2',
        name: 'Jane Doe',
        email: 'jane@example.com',
        cpf: '11144477735',
        phone: '11999998888',
        accessCount: 3,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
    ];

    const paginatedResult: PaginatedResult<any> = {
      items: mockClients,
      total: 2,
      page: 1,
      limit: 5,
      totalPages: 1,
    };

    clientRepository.findAll.mockResolvedValue(paginatedResult);

    const result = await handler.execute(query);

    expect(result.clients).toHaveLength(2);
    expect(result.clients[0].id).toBe('1');
    expect(result.clients[0].name).toBe('John Doe');
    expect(result.clients[1].id).toBe('2');
    expect(result.clients[1].name).toBe('Jane Doe');

    expect(clientRepository.findAll).toHaveBeenCalledWith({
      page: 1,
      limit: 5,
      sortBy: 'createdAt',
      sortOrder: 'DESC',
    });
  });

  it('should request clients sorted by createdAt DESC', async () => {
    const query = new GetLatestClientsQuery(10);

    const paginatedResult: PaginatedResult<any> = {
      items: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };

    clientRepository.findAll.mockResolvedValue(paginatedResult);

    await handler.execute(query);

    expect(clientRepository.findAll).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'DESC',
    });
  });

  it('should respect the limit parameter', async () => {
    const query = new GetLatestClientsQuery(3);

    const paginatedResult: PaginatedResult<any> = {
      items: [],
      total: 0,
      page: 1,
      limit: 3,
      totalPages: 0,
    };

    clientRepository.findAll.mockResolvedValue(paginatedResult);

    await handler.execute(query);

    expect(clientRepository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: 3,
      })
    );
  });

  it('should return empty array when no clients found', async () => {
    const query = new GetLatestClientsQuery(5);

    const paginatedResult: PaginatedResult<any> = {
      items: [],
      total: 0,
      page: 1,
      limit: 5,
      totalPages: 0,
    };

    clientRepository.findAll.mockResolvedValue(paginatedResult);

    const result = await handler.execute(query);

    expect(result.clients).toEqual([]);
  });

  it('should map all client fields correctly', async () => {
    const query = new GetLatestClientsQuery(1);

    const mockClient = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      cpf: '12345678909',
      phone: '11987654321',
      accessCount: 10,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    };

    const paginatedResult: PaginatedResult<any> = {
      items: [mockClient],
      total: 1,
      page: 1,
      limit: 1,
      totalPages: 1,
    };

    clientRepository.findAll.mockResolvedValue(paginatedResult);

    const result = await handler.execute(query);

    expect(result.clients[0]).toEqual({
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      cpf: '12345678909',
      phone: '11987654321',
      accessCount: 10,
      createdAt: mockClient.createdAt,
      updatedAt: mockClient.updatedAt,
    });
  });

  it('should always request page 1', async () => {
    const query = new GetLatestClientsQuery(5);

    const paginatedResult: PaginatedResult<any> = {
      items: [],
      total: 0,
      page: 1,
      limit: 5,
      totalPages: 0,
    };

    clientRepository.findAll.mockResolvedValue(paginatedResult);

    await handler.execute(query);

    expect(clientRepository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 1,
      })
    );
  });

  it('should handle different limit values', async () => {
    const query = new GetLatestClientsQuery(20);

    const paginatedResult: PaginatedResult<any> = {
      items: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    };

    clientRepository.findAll.mockResolvedValue(paginatedResult);

    await handler.execute(query);

    expect(clientRepository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: 20,
      })
    );
  });
});
