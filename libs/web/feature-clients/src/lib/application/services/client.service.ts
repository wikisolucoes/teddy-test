/**
 * Client Service - Camada de aplicação
 * Orquestra as operações de clientes e pode aplicar regras de negócio
 */

import { clientRepository } from '../../infrastructure/api/repositories/client.repository';
import type { PaginatedResponse } from '@teddy-monorepo/web/shared';
import type { ClientEntity } from '../../domain/entities/client.entity';
import type {
  CreateClientDto,
  UpdateClientDto,
  ClientResponseDto,
} from '../dtos/client.dto';

/**
 * Serviço responsável por operações de clientes
 */
export class ClientService {
  /**
   * Busca clientes com paginação
   */
  async getClients(
    page = 1,
    limit = 16
  ): Promise<PaginatedResponse<ClientEntity>> {
    try {
      return await clientRepository.findAll(page, limit);
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  }

  /**
   * Busca um cliente por ID
   */
  async getClientById(id: string): Promise<ClientResponseDto> {
    try {
      return await clientRepository.findById(id);
    } catch (error) {
      console.error(`Error fetching client ${id}:`, error);
      throw error;
    }
  }

  /**
   * Cria um novo cliente
   */
  async createClient(data: CreateClientDto): Promise<ClientResponseDto> {
    try {
      return await clientRepository.create(data);
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  }

  /**
   * Atualiza um cliente existente
   */
  async updateClient(
    id: string,
    data: UpdateClientDto
  ): Promise<ClientResponseDto> {
    try {
      return await clientRepository.update(id, data);
    } catch (error) {
      console.error(`Error updating client ${id}:`, error);
      throw error;
    }
  }

  /**
   * Deleta um cliente
   */
  async deleteClient(id: string): Promise<void> {
    try {
      await clientRepository.delete(id);
    } catch (error) {
      console.error(`Error deleting client ${id}:`, error);
      throw error;
    }
  }
}

// Exporta uma instância singleton do serviço
export const clientService = new ClientService();
