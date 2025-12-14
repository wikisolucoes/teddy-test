import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UpdateClientHandler } from './update-client.handler.js';
import { UpdateClientCommand } from '../commands/update-client.command.js';
import { ClientRepository } from '../../ports/client.repository.js';
import { Client } from '../../../domain/entities/client.entity.js';

class MockClientRepository{
  findById = jest.fn();
  findByEmail = jest.fn();
  findByCpf = jest.fn();
  save = jest.fn();
}

jest.mock('../../ports/client.repository');

describe('UpdateClientHandler', () => {
  let handler: UpdateClientHandler;
  let clientRepository: jest.Mocked<ClientRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateClientHandler,
        {
          provide: ClientRepository,
          useClass: MockClientRepository,
        },
      ],
    }).compile();

    handler = module.get<UpdateClientHandler>(UpdateClientHandler);
    clientRepository = module.get(ClientRepository);
  });

  it('should update a client successfully', async () => {
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

    const command = new UpdateClientCommand(
      '123',
      'John Updated',
      'john.updated@example.com',
      '111.444.777-35',
      '(11) 99999-8888'
    );

    clientRepository.findById.mockResolvedValue(existingClient);
    clientRepository.findByEmail.mockResolvedValue(null);
    clientRepository.findByCpf.mockResolvedValue(null);

    const updatedClient = new Client(
      'John Updated',
      'john.updated@example.com',
      '11144477735',
      '11999998888',
      5,
      '123',
      new Date('2024-01-01'),
      new Date('2024-01-02'),
      null
    );

    clientRepository.save.mockResolvedValue(updatedClient);

    const result = await handler.execute(command);

    expect(result).toEqual({
      id: '123',
      name: 'John Updated',
      email: 'john.updated@example.com',
      cpf: '111.444.777-35',
      phone: '(11) 99999-8888',
      accessCount: 5,
      createdAt: updatedClient.createdAt,
      updatedAt: updatedClient.updatedAt,
    });

    expect(clientRepository.findById).toHaveBeenCalledWith('123');
    expect(clientRepository.save).toHaveBeenCalled();
  });

  it('should throw NotFoundException when client does not exist', async () => {
    const command = new UpdateClientCommand('999', 'John Doe');

    clientRepository.findById.mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
    await expect(handler.execute(command)).rejects.toThrow('Client not found');

    expect(clientRepository.findById).toHaveBeenCalledWith('999');
    expect(clientRepository.save).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when email is already in use by another client', async () => {
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

    const anotherClient = new Client(
      'Jane Doe',
      'jane@example.com',
      '11144477735',
      '11999998888',
      3,
      '456',
      new Date(),
      new Date(),
      null
    );

    const command = new UpdateClientCommand('123', undefined, 'jane@example.com');

    clientRepository.findById.mockResolvedValue(existingClient);
    clientRepository.findByEmail.mockResolvedValue(anotherClient);

    await expect(handler.execute(command)).rejects.toThrow(ConflictException);
    await expect(handler.execute(command)).rejects.toThrow('Email already in use');

    expect(clientRepository.findById).toHaveBeenCalledWith('123');
    expect(clientRepository.findByEmail).toHaveBeenCalledWith('jane@example.com');
    expect(clientRepository.save).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when CPF is already in use by another client', async () => {
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

    const anotherClient = new Client(
      'Jane Doe',
      'jane@example.com',
      '11144477735',
      '11999998888',
      3,
      '456',
      new Date(),
      new Date(),
      null
    );

    const command = new UpdateClientCommand('123', undefined, undefined, '111.444.777-35');

    clientRepository.findById.mockResolvedValue(existingClient);
    clientRepository.findByCpf.mockResolvedValue(anotherClient);

    await expect(handler.execute(command)).rejects.toThrow(ConflictException);
    await expect(handler.execute(command)).rejects.toThrow('CPF already in use');

    expect(clientRepository.findById).toHaveBeenCalledWith('123');
    expect(clientRepository.findByCpf).toHaveBeenCalledWith('11144477735');
    expect(clientRepository.save).not.toHaveBeenCalled();
  });

  it('should allow updating with same email', async () => {
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

    const command = new UpdateClientCommand('123', 'John Updated', 'john@example.com');

    clientRepository.findById.mockResolvedValue(existingClient);

    const updatedClient = new Client(
      'John Updated',
      'john@example.com',
      '12345678909',
      '11987654321',
      5,
      '123',
      new Date('2024-01-01'),
      new Date('2024-01-02'),
      null
    );

    clientRepository.save.mockResolvedValue(updatedClient);

    const result = await handler.execute(command);

    expect(result.name).toBe('John Updated');
    expect(result.email).toBe('john@example.com');
    expect(clientRepository.findByEmail).not.toHaveBeenCalled();
  });

  it('should allow updating with same CPF', async () => {
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

    const command = new UpdateClientCommand('123', 'John Updated', undefined, '123.456.789-09');

    clientRepository.findById.mockResolvedValue(existingClient);

    const updatedClient = new Client(
      'John Updated',
      'john@example.com',
      '12345678909',
      '11987654321',
      5,
      '123',
      new Date('2024-01-01'),
      new Date('2024-01-02'),
      null
    );

    clientRepository.save.mockResolvedValue(updatedClient);

    const result = await handler.execute(command);

    expect(result.cpf).toBe('123.456.789-09');
    expect(clientRepository.findByCpf).not.toHaveBeenCalled();
  });

  it('should update only provided fields', async () => {
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

    const command = new UpdateClientCommand('123', 'John Updated');

    clientRepository.findById.mockResolvedValue(existingClient);

    const updatedClient = new Client(
      'John Updated',
      'john@example.com',
      '12345678909',
      '11987654321',
      5,
      '123',
      new Date('2024-01-01'),
      new Date('2024-01-02'),
      null
    );

    clientRepository.save.mockResolvedValue(updatedClient);

    await handler.execute(command);

    expect(clientRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John Updated',
        email: 'john@example.com',
        cpf: '12345678909',
        phone: '11987654321',
      })
    );
  });

  it('should preserve accessCount when updating', async () => {
    const existingClient = new Client(
      'John Doe',
      'john@example.com',
      '12345678909',
      '11987654321',
      10,
      '123',
      new Date('2024-01-01'),
      new Date('2024-01-01'),
      null
    );

    const command = new UpdateClientCommand('123', 'John Updated');

    clientRepository.findById.mockResolvedValue(existingClient);

    const updatedClient = new Client(
      'John Updated',
      'john@example.com',
      '12345678909',
      '11987654321',
      10,
      '123',
      new Date('2024-01-01'),
      new Date('2024-01-02'),
      null
    );

    clientRepository.save.mockResolvedValue(updatedClient);

    const result = await handler.execute(command);

    expect(result.accessCount).toBe(10);
  });

  it('should throw BadRequestException when CPF is invalid', async () => {
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

    const command = new UpdateClientCommand('123', undefined, undefined, '123.456.789-00');

    clientRepository.findById.mockResolvedValue(existingClient);

    await expect(handler.execute(command)).rejects.toThrow('Invalid CPF');
  });

  it('should throw BadRequestException when phone is invalid', async () => {
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

    const command = new UpdateClientCommand('123', undefined, undefined, undefined, '(00) 98765-4321');

    clientRepository.findById.mockResolvedValue(existingClient);

    await expect(handler.execute(command)).rejects.toThrow('Invalid phone number');
  });
});
