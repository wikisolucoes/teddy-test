import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeleteClientHandler } from './delete-client.handler.js';
import { DeleteClientCommand } from '../commands/delete-client.command.js';
import { ClientRepository } from '../../ports/client.repository.js';
import { Client } from '../../../domain/entities/client.entity.js';

class MockLogger {
  info = jest.fn();
  error = jest.fn();
  warn = jest.fn();
  debug = jest.fn();
}

class MockClientRepository {
  findById = jest.fn();
  softDelete = jest.fn();
}

jest.mock('../../ports/client.repository');

describe('DeleteClientHandler', () => {
  let handler: DeleteClientHandler;
  let clientRepository: jest.Mocked<ClientRepository>;
  let logger: MockLogger;

  beforeEach(async () => {
    logger = new MockLogger();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteClientHandler,
        {
          provide: ClientRepository,
          useClass: MockClientRepository,
        },
        {
          provide: 'winston',
          useValue: logger,
        },
      ],
    }).compile();

    handler = module.get<DeleteClientHandler>(DeleteClientHandler);
    clientRepository = module.get(ClientRepository);
  });

  it('should soft delete a client successfully', async () => {
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

    const command = new DeleteClientCommand('123');

    clientRepository.findById.mockResolvedValue(existingClient);
    clientRepository.softDelete.mockResolvedValue(undefined);

    await handler.execute(command);

    expect(clientRepository.findById).toHaveBeenCalledWith('123');
    expect(clientRepository.softDelete).toHaveBeenCalledWith('123');
    expect(logger.info).toHaveBeenCalledWith('Client deleted (soft)', { clientId: '123' });
  });

  it('should throw NotFoundException when client does not exist', async () => {
    const command = new DeleteClientCommand('999');

    clientRepository.findById.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
    await expect(handler.execute(command)).rejects.toThrow('Client not found');

    expect(clientRepository.findById).toHaveBeenCalledWith('999');
    expect(clientRepository.softDelete).not.toHaveBeenCalled();
    expect(logger.info).not.toHaveBeenCalled();
  });

  it('should not call softDelete if client not found', async () => {
    const command = new DeleteClientCommand('999');

    clientRepository.findById.mockResolvedValue(null);

    try {
      await handler.execute(command);
    } catch {
      // Expected exception
    }

    expect(clientRepository.softDelete).not.toHaveBeenCalled();
  });

  it('should perform soft delete instead of hard delete', async () => {
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

    const command = new DeleteClientCommand('123');

    clientRepository.findById.mockResolvedValue(existingClient);
    clientRepository.softDelete.mockResolvedValue(undefined);

    await handler.execute(command);

    expect(clientRepository.softDelete).toHaveBeenCalledWith('123');
  });

  it('should log deletion with client ID', async () => {
    const existingClient = new Client(
      'John Doe',
      'john@example.com',
      '12345678909',
      '11987654321',
      5,
      '456',
      new Date(),
      new Date(),
      null
    );

    const command = new DeleteClientCommand('456');

    clientRepository.findById.mockResolvedValue(existingClient);
    clientRepository.softDelete.mockResolvedValue(undefined);

    await handler.execute(command);

    expect(logger.info).toHaveBeenCalledWith('Client deleted (soft)', { clientId: '456' });
  });
});
