import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { CreateClientHandler } from './create-client.handler.js';
import { CreateClientCommand } from '../commands/create-client.command.js';
import { ClientRepository } from '../../ports/client.repository.js';
import { Client } from '../../../domain/entities/client.entity.js';

class MockLogger {
  info = jest.fn();
  error = jest.fn();
  warn = jest.fn();
  debug = jest.fn();
}

class MockClientRepository {
  findByEmail = jest.fn();
  findByCpf = jest.fn();
  save = jest.fn();
}

jest.mock('../../ports/client.repository');

describe('CreateClientHandler', () => {
  let handler: CreateClientHandler;
  let clientRepository: jest.Mocked<ClientRepository>;
  let logger: MockLogger;

  beforeEach(async () => {
    logger = new MockLogger();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateClientHandler,
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

    handler = module.get<CreateClientHandler>(CreateClientHandler);
    clientRepository = module.get(ClientRepository);
  });

  it('should create a new client successfully', async () => {
    const command = new CreateClientCommand(
      'John Doe',
      'john@example.com',
      '123.456.789-09',
      '(11) 98765-4321'
    );

    clientRepository.findByEmail.mockResolvedValue(null);
    clientRepository.findByCpf.mockResolvedValue(null);
    
    const savedClient = new Client(
      'John Doe',
      'john@example.com',
      '12345678909',
      '11987654321',
      0,
      '123',
      new Date('2024-01-01'),
      new Date('2024-01-01'),
      null
    );
    
    clientRepository.save.mockResolvedValue(savedClient);

    const result = await handler.execute(command);

    expect(result).toEqual({
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      cpf: '123.456.789-09',
      phone: '(11) 98765-4321',
      accessCount: 0,
      createdAt: savedClient.createdAt,
      updatedAt: savedClient.updatedAt,
    });

    expect(clientRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
    expect(clientRepository.findByCpf).toHaveBeenCalledWith('12345678909');
    expect(clientRepository.save).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith('Client created', { clientId: '123' });
  });

  it('should throw ConflictException when email already exists', async () => {
    const command = new CreateClientCommand(
      'John Doe',
      'john@example.com',
      '123.456.789-09',
      '(11) 98765-4321'
    );

    const existingClient = new Client(
      'Jane Doe',
      'john@example.com',
      '11144477735',
      '11987654321',
      0,
      '456',
      new Date(),
      new Date(),
      null
    );

    clientRepository.findByEmail.mockResolvedValue(existingClient);

    await expect(handler.execute(command)).rejects.toThrow(ConflictException);
    await expect(handler.execute(command)).rejects.toThrow('Email already exists');

    expect(clientRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
    expect(clientRepository.findByCpf).not.toHaveBeenCalled();
    expect(clientRepository.save).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when CPF already exists', async () => {
    const command = new CreateClientCommand(
      'John Doe',
      'john@example.com',
      '123.456.789-09',
      '(11) 98765-4321'
    );

    const existingClient = new Client(
      'Jane Doe',
      'jane@example.com',
      '12345678909',
      '11987654321',
      0,
      '456',
      new Date(),
      new Date(),
      null
    );

    clientRepository.findByEmail.mockResolvedValue(null);
    clientRepository.findByCpf.mockResolvedValue(existingClient);

    await expect(handler.execute(command)).rejects.toThrow(ConflictException);
    await expect(handler.execute(command)).rejects.toThrow('CPF already exists');

    expect(clientRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
    expect(clientRepository.findByCpf).toHaveBeenCalledWith('12345678909');
    expect(clientRepository.save).not.toHaveBeenCalled();
  });

  it('should validate and normalize CPF before saving', async () => {
    const command = new CreateClientCommand(
      'John Doe',
      'john@example.com',
      '123.456.789-09',
      '(11) 98765-4321'
    );

    clientRepository.findByEmail.mockResolvedValue(null);
    clientRepository.findByCpf.mockResolvedValue(null);

    const savedClient = new Client(
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

    clientRepository.save.mockResolvedValue(savedClient);

    await handler.execute(command);

    expect(clientRepository.findByCpf).toHaveBeenCalledWith('12345678909');
    expect(clientRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        cpf: '12345678909',
      })
    );
  });

  it('should validate and normalize phone before saving', async () => {
    const command = new CreateClientCommand(
      'John Doe',
      'john@example.com',
      '123.456.789-09',
      '(11) 98765-4321'
    );

    clientRepository.findByEmail.mockResolvedValue(null);
    clientRepository.findByCpf.mockResolvedValue(null);

    const savedClient = new Client(
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

    clientRepository.save.mockResolvedValue(savedClient);

    await handler.execute(command);

    expect(clientRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        phone: '11987654321',
      })
    );
  });

  it('should throw BadRequestException when CPF is invalid', async () => {
    const command = new CreateClientCommand(
      'John Doe',
      'john@example.com',
      '123.456.789-00',
      '(11) 98765-4321'
    );

    await expect(handler.execute(command)).rejects.toThrow('Invalid CPF');
  });

  it('should throw BadRequestException when phone is invalid', async () => {
    const command = new CreateClientCommand(
      'John Doe',
      'john@example.com',
      '123.456.789-09',
      '(00) 98765-4321'
    );

    await expect(handler.execute(command)).rejects.toThrow('Invalid phone number');
  });

  it('should initialize accessCount to 0 for new clients', async () => {
    const command = new CreateClientCommand(
      'John Doe',
      'john@example.com',
      '123.456.789-09',
      '(11) 98765-4321'
    );

    clientRepository.findByEmail.mockResolvedValue(null);
    clientRepository.findByCpf.mockResolvedValue(null);

    const savedClient = new Client(
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

    clientRepository.save.mockResolvedValue(savedClient);

    await handler.execute(command);

    expect(clientRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        accessCount: 0,
      })
    );
  });

  it('should return formatted CPF and phone in response', async () => {
    const command = new CreateClientCommand(
      'John Doe',
      'john@example.com',
      '12345678909',
      '11987654321'
    );

    clientRepository.findByEmail.mockResolvedValue(null);
    clientRepository.findByCpf.mockResolvedValue(null);

    const savedClient = new Client(
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

    clientRepository.save.mockResolvedValue(savedClient);

    const result = await handler.execute(command);

    expect(result.cpf).toBe('123.456.789-09');
    expect(result.phone).toBe('(11) 98765-4321');
  });
});
