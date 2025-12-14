/**
 * Client Repository Interface - Abstração para operações de clientes
 * Define o contrato para implementações de repositório
 */

import type { PaginatedResponse } from '@teddy-monorepo/web/shared';
import type { ClientEntity } from '../entities/client.entity';

export interface CreateClientData {
  name: string;
  salary: number;
  companyValuation: number;
}

export interface UpdateClientData {
  name?: string;
  salary?: number;
  companyValuation?: number;
}

/**
 * Interface do repositório de clientes
 */
export interface IClientRepository {
  findAll(page: number, limit: number): Promise<PaginatedResponse<ClientEntity>>;
  findById(id: string): Promise<ClientEntity>;
  create(data: CreateClientData): Promise<ClientEntity>;
  update(id: string, data: UpdateClientData): Promise<ClientEntity>;
  delete(id: string): Promise<void>;
}
