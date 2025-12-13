import { BaseRepository } from '@teddy-monorepo/api/core';
import type { FindAllOptions, PaginatedResult } from '@teddy-monorepo/api/core';
import type { Client } from '../../domain/entities/client.entity.js';

export abstract class ClientRepository extends BaseRepository<Client> {
  abstract findByEmail(email: string): Promise<Client | null>;
  abstract findByCpf(cpf: string): Promise<Client | null>;
  abstract findAll(options: FindAllOptions): Promise<PaginatedResult<Client>>;
  abstract incrementAccessCount(id: string): Promise<void>;
}
