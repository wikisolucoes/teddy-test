import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetClientHandler } from './get-client.handler.js';
import { GetClientQuery } from '../queries/get-client.query.js';
import { ClientRepository } from '../../ports/client.repository.js';
import { Client } from '../../../domain/entities/client.entity.js';

class MockClientRepository{
  findById = jest.fn();
  incrementAccessCount = jest.fn();
}

jest.mock('../../ports/client.repository');

describe('GetClientHandler', () => {
  let handler: GetClientHandler;
  let clientRepository: jest.Mocked<ClientRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetClientHandler,
        {
          provide: ClientRepository,
          useClass: MockClientRepository,
        },
      ],
    }).compile();

    handler = module.get<GetClientHandler>(GetClientHandler);
    clientRepository = module.get(ClientRepository);
  });

  it('should retrieve a client successfully and increment access count', async () => {
    const existingClient = new Client(
      'John Doe',
      'john@example.com',
      '12345678909',
      '11987654321',
      5,
      '123',
      new Date('2024-01-01'),
      new Date('2024-01-01'),
      null
    );

    const query = new GetClientQuery('123');

    clientRepository.findById.mockResolvedValue(existingClient);
    clientRepository.incrementAccessCount.mockResolvedValue(undefined);

    const result = await handler.execute(query);

    expect(result).toEqual({
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      cpf: '123.456.789-09',
      phone: '(11) 98765-4321',
      accessCount: 6,
      createdAt: existingClient.createdAt,
      updatedAt: existingClient.updatedAt,
    });

    expect(clientRepository.findById).toHaveBeenCalledWith('123');
    expect(clientRepository.incrementAccessCount).toHaveBeenCalledWith('123');
  });

  it('should throw NotFoundException when client does not exist', async () => {
    const query = new GetClientQuery('999');

    clientRepository.findById.mockResolvedValue(null);

    await expect(handler.execute(query)).rejects.toThrow(NotFoundException);
    await expect(handler.execute(query)).rejects.toThrow('Client not found');

    expect(clientRepository.findById).toHaveBeenCalledWith('999');
    expect(clientRepository.incrementAccessCount).not.toHaveBeenCalled();
  });

  it('should increment access count after finding client', async () => {
    const existingClient = new Client(
      'John Doe',
      'john@example.com',
      '12345678909',
      '11987654321',
      10,
      '123',
      new Date(),
      new Date(),
      null
    );

    const query = new GetClientQuery('123');

    clientRepository.findById.mockResolvedValue(existingClient);
    clientRepository.incrementAccessCount.mockResolvedValue(undefined);

    await handler.execute(query);

    expect(clientRepository.incrementAccessCount).toHaveBeenCalledTimes(1);
    expect(clientRepository.incrementAccessCount).toHaveBeenCalledWith('123');
  });

  it('should return formatted CPF and phone', async () => {
    const existingClient = new Client(
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

    const query = new GetClientQuery('123');

    clientRepository.findById.mockResolvedValue(existingClient);
    clientRepository.incrementAccessCount.mockResolvedValue(undefined);

    const result = await handler.execute(query);

    expect(result.cpf).toBe('123.456.789-09');
    expect(result.phone).toBe('(11) 98765-4321');
  });

  it('should return accessCount incremented by 1', async () => {
    const existingClient = new Client(
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

    const query = new GetClientQuery('123');

    clientRepository.findById.mockResolvedValue(existingClient);
    clientRepository.incrementAccessCount.mockResolvedValue(undefined);

    const result = await handler.execute(query);

    expect(result.accessCount).toBe(1);
  });

  it('should not increment access count if client not found', async () => {
    const query = new GetClientQuery('999');

    clientRepository.findById.mockResolvedValue(null);

    try {
      await handler.execute(query);
    } catch {
      // Expected exception
    }

    expect(clientRepository.incrementAccessCount).not.toHaveBeenCalled();
  });

  it('should call incrementAccessCount only once per query', async () => {
    const existingClient = new Client(
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

    const query = new GetClientQuery('123');

    clientRepository.findById.mockResolvedValue(existingClient);
    clientRepository.incrementAccessCount.mockResolvedValue(undefined);

    await handler.execute(query);

    expect(clientRepository.incrementAccessCount).toHaveBeenCalledTimes(1);
  });
});
