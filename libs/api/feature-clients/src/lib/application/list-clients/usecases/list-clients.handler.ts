import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { PaginatedResult } from '@teddy-monorepo/api/core';
import { ListClientsQuery } from '../queries/list-clients.query.js';
import { ClientRepository } from '../../ports/client.repository.js';
import { CPF } from '../../../domain/value-objects/cpf.vo.js';
import { Phone } from '../../../domain/value-objects/phone.vo.js';
import type { ClientDto } from '../../shared/dtos/client.dto.js';

@QueryHandler(ListClientsQuery)
export class ListClientsHandler implements IQueryHandler<ListClientsQuery, PaginatedResult<ClientDto>> {
  constructor(
    @Inject(ClientRepository)
    private readonly clientRepository: ClientRepository
  ) {}

  async execute(query: ListClientsQuery): Promise<PaginatedResult<ClientDto>> {
    const result = await this.clientRepository.findAll(query.options);
    
    return {
      items: result.items.map(client => ({
        id: client.id,
        name: client.name,
        email: client.email,
        cpf: new CPF(client.cpf).getFormattedValue(),
        phone: new Phone(client.phone).getFormattedValue(),
        accessCount: client.accessCount,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
      })),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }
}
