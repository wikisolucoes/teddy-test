import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetLatestClientsQuery } from '../queries/get-latest-clients.query.js';
import type { LatestClientsDto } from '../dtos/latest-clients.dto.js';
import { ClientRepository } from '@teddy-monorepo/api/feature-clients';

@QueryHandler(GetLatestClientsQuery)
export class GetLatestClientsHandler
  implements IQueryHandler<GetLatestClientsQuery, LatestClientsDto>
{
  constructor(
    @Inject(ClientRepository)
    private readonly clientRepository: ClientRepository
  ) {}

  async execute(query: GetLatestClientsQuery): Promise<LatestClientsDto> {
    const result = await this.clientRepository.findAll({
      page: 1,
      limit: query.limit,
      sortBy: 'createdAt',
      sortOrder: 'DESC',
    });

    return {
      clients: result.items.map((client) => ({
        id: client.id,
        name: client.name,
        email: client.email,
        cpf: client.cpf,
        phone: client.phone,
        accessCount: client.accessCount,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
      })),
    };
  }
}
