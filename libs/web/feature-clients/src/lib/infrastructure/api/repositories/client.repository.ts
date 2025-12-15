import { apiClient } from '@teddy-monorepo/web/core';
import { API_ENDPOINTS } from '@teddy-monorepo/web/core';
import type { PaginatedResponse } from '@teddy-monorepo/web/shared';
import type {
  IClientRepository,
  CreateClientData,
  UpdateClientData,
} from '../../domain/repositories/client.repository.interface';
import type { ClientEntity } from '../../domain/entities/client.entity';
import type {
  CreateClientDto,
  UpdateClientDto,
  ClientResponseDto,
  PaginatedClientsDto,
} from '../../application/dtos/client.dto';

export class ClientRepository implements IClientRepository {
  async findAll(
    page: number,
    limit: number
  ): Promise<PaginatedResponse<ClientEntity>> {
    const response = await apiClient.get<PaginatedClientsDto>(
      API_ENDPOINTS.CLIENTS.BASE,
      { params: { page, limit } }
    );
    return response.data;
  }

  async findById(id: string): Promise<ClientEntity> {
    const response = await apiClient.get<ClientResponseDto>(
      API_ENDPOINTS.CLIENTS.BY_ID(id)
    );
    return response.data;
  }

  async create(data: CreateClientData): Promise<ClientEntity> {
    const dto: CreateClientDto = {
      name: data.name,
      email: data.email,
      cpf: data.cpf,
      phone: data.phone,
    };

    const response = await apiClient.post<ClientResponseDto>(
      API_ENDPOINTS.CLIENTS.BASE,
      dto
    );
    return response.data;
  }

  async update(id: string, data: UpdateClientData): Promise<ClientEntity> {
    const dto: UpdateClientDto = {};

    if (data.name !== undefined) dto.name = data.name;
    if (data.email !== undefined) dto.email = data.email;
    if (data.cpf !== undefined) dto.cpf = data.cpf;
    if (data.phone !== undefined) dto.phone = data.phone;

    const response = await apiClient.put<ClientResponseDto>(
      API_ENDPOINTS.CLIENTS.BY_ID(id),
      dto
    );
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.CLIENTS.BY_ID(id));
  }
}

export const clientRepository = new ClientRepository();
