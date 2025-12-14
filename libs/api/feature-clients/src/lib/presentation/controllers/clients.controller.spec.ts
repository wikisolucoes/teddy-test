import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller.js';
import { ClientService } from '../../application/services/client.service.js';
import type { CreateClientDto } from '../../application/create-client/dtos/create-client.dto.js';
import type { UpdateClientDto } from '../../application/update-client/dtos/update-client.dto.js';
import type { ListClientsDto } from '../../application/list-clients/dtos/list-clients.dto.js';
import type { ClientDto } from '../../application/shared/dtos/client.dto.js';
import type { PaginatedResult } from '@teddy-monorepo/api/core';

jest.mock('../../application/services/client.service');

describe('ClientsController', () => {
  let controller: ClientsController;
  let clientService: jest.Mocked<ClientService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [ClientService],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
    clientService = module.get(ClientService);
  });

  describe('create', () => {
    it('should create a new client', async () => {
      const dto: CreateClientDto = {
        name: 'John Doe',
        email: 'john@example.com',
        cpf: '123.456.789-09',
        phone: '(11) 98765-4321',
      };

      const expectedResult: ClientDto = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        cpf: '123.456.789-09',
        phone: '(11) 98765-4321',
        accessCount: 0,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      clientService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(dto);

      expect(result).toEqual(expectedResult);
      expect(clientService.create).toHaveBeenCalledWith(dto);
    });

    it('should call service with provided DTO', async () => {
      const dto: CreateClientDto = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        cpf: '111.444.777-35',
        phone: '(21) 99999-8888',
      };

      const expectedResult: ClientDto = {
        id: '456',
        name: 'Jane Doe',
        email: 'jane@example.com',
        cpf: '111.444.777-35',
        phone: '(21) 99999-8888',
        accessCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      clientService.create.mockResolvedValue(expectedResult);

      await controller.create(dto);

      expect(clientService.create).toHaveBeenCalledTimes(1);
      expect(clientService.create).toHaveBeenCalledWith(dto);
    });

    it('should propagate errors from service', async () => {
      const dto: CreateClientDto = {
        name: 'John Doe',
        email: 'john@example.com',
        cpf: '123.456.789-09',
        phone: '(11) 98765-4321',
      };

      const error = new Error('Email already exists');
      clientService.create.mockRejectedValue(error);

      await expect(controller.create(dto)).rejects.toThrow('Email already exists');
    });
  });

  describe('list', () => {
    it('should list clients with pagination', async () => {
      const dto: ListClientsDto = {
        page: 1,
        limit: 10,
      };

      const expectedResult: PaginatedResult<ClientDto> = {
        items: [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            cpf: '123.456.789-09',
            phone: '(11) 98765-4321',
            accessCount: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      clientService.list.mockResolvedValue(expectedResult);

      const result = await controller.list(dto);

      expect(result).toEqual(expectedResult);
      expect(clientService.list).toHaveBeenCalledWith(dto);
    });

    it('should support search and sorting', async () => {
      const dto: ListClientsDto = {
        page: 1,
        limit: 10,
        search: 'John',
        sortBy: 'name',
        sortOrder: 'ASC',
      };

      const expectedResult: PaginatedResult<ClientDto> = {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      clientService.list.mockResolvedValue(expectedResult);

      await controller.list(dto);

      expect(clientService.list).toHaveBeenCalledWith(dto);
    });

    it('should propagate errors from service', async () => {
      const dto: ListClientsDto = {
        page: 1,
        limit: 10,
      };

      const error = new Error('Database error');
      clientService.list.mockRejectedValue(error);

      await expect(controller.list(dto)).rejects.toThrow('Database error');
    });
  });

  describe('getById', () => {
    it('should get a client by ID', async () => {
      const expectedResult: ClientDto = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        cpf: '123.456.789-09',
        phone: '(11) 98765-4321',
        accessCount: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      clientService.getById.mockResolvedValue(expectedResult);

      const result = await controller.getById('123');

      expect(result).toEqual(expectedResult);
      expect(clientService.getById).toHaveBeenCalledWith('123');
    });

    it('should increment access count when retrieving', async () => {
      const expectedResult: ClientDto = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        cpf: '123.456.789-09',
        phone: '(11) 98765-4321',
        accessCount: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      clientService.getById.mockResolvedValue(expectedResult);

      const result = await controller.getById('123');

      expect(result.accessCount).toBe(10);
      expect(clientService.getById).toHaveBeenCalledWith('123');
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Client not found');
      clientService.getById.mockRejectedValue(error);

      await expect(controller.getById('999')).rejects.toThrow('Client not found');
    });
  });

  describe('update', () => {
    it('should update a client', async () => {
      const dto: UpdateClientDto = {
        name: 'John Updated',
        email: 'john.updated@example.com',
      };

      const expectedResult: ClientDto = {
        id: '123',
        name: 'John Updated',
        email: 'john.updated@example.com',
        cpf: '123.456.789-09',
        phone: '(11) 98765-4321',
        accessCount: 5,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      clientService.update.mockResolvedValue(expectedResult);

      const result = await controller.update('123', dto);

      expect(result).toEqual(expectedResult);
      expect(clientService.update).toHaveBeenCalledWith('123', dto);
    });

    it('should support partial updates', async () => {
      const dto: UpdateClientDto = {
        name: 'John Updated',
      };

      const expectedResult: ClientDto = {
        id: '123',
        name: 'John Updated',
        email: 'john@example.com',
        cpf: '123.456.789-09',
        phone: '(11) 98765-4321',
        accessCount: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      clientService.update.mockResolvedValue(expectedResult);

      await controller.update('123', dto);

      expect(clientService.update).toHaveBeenCalledWith('123', dto);
    });

    it('should propagate errors from service', async () => {
      const dto: UpdateClientDto = {
        name: 'John Updated',
      };

      const error = new Error('Client not found');
      clientService.update.mockRejectedValue(error);

      await expect(controller.update('999', dto)).rejects.toThrow('Client not found');
    });
  });

  describe('delete', () => {
    it('should delete a client', async () => {
      clientService.delete.mockResolvedValue(undefined);

      await controller.delete('123');

      expect(clientService.delete).toHaveBeenCalledWith('123');
    });

    it('should return void on successful deletion', async () => {
      clientService.delete.mockResolvedValue(undefined);

      const result = await controller.delete('123');

      expect(result).toBeUndefined();
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Client not found');
      clientService.delete.mockRejectedValue(error);

      await expect(controller.delete('999')).rejects.toThrow('Client not found');
    });
  });
});
