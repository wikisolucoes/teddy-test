/**
 * Client Repository - Implementação da camada de infraestrutura
 * Integração com API usando apiClient
 */

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

/**
 * Repositório para operações relacionadas a clientes
 */
export class ClientRepository implements IClientRepository {
  /**
   * Busca todos os clientes com paginação
   */
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

  /**
   * Busca um cliente por ID
   */
  async findById(id: string): Promise<ClientEntity> {
    const response = await apiClient.get<ClientResponseDto>(
      API_ENDPOINTS.CLIENTS.BY_ID(id)
    );
    return response.data;
  }

  /**
   * Cria um novo cliente
   */
  async create(data: CreateClientData): Promise<ClientEntity> {
    const dto: CreateClientDto = {
      name: data.name,
      salary: data.salary,
      companyValuation: data.companyValuation,
    };

    const response = await apiClient.post<ClientResponseDto>(
      API_ENDPOINTS.CLIENTS.BASE,
      dto
    );
    return response.data;
  }

  /**
   * Atualiza um cliente existente
   */
  async update(id: string, data: UpdateClientData): Promise<ClientEntity> {
    const dto: UpdateClientDto = {};

    if (data.name !== undefined) dto.name = data.name;
    if (data.salary !== undefined) dto.salary = data.salary;
    if (data.companyValuation !== undefined) {
      dto.companyValuation = data.companyValuation;
    }

    const response = await apiClient.put<ClientResponseDto>(
      API_ENDPOINTS.CLIENTS.BY_ID(id),
      dto
    );
    return response.data;
  }

  /**
   * Deleta um cliente
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.CLIENTS.BY_ID(id));
  }
}

// Exporta uma instância singleton do repositório
export const clientRepository = new ClientRepository();
