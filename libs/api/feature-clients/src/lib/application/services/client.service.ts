import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import type { PaginatedResult } from '@teddy-monorepo/api/core';
import { CreateClientCommand } from '../create-client/commands/create-client.command.js';
import { ListClientsQuery } from '../list-clients/queries/list-clients.query.js';
import { GetClientQuery } from '../get-client/queries/get-client.query.js';
import { UpdateClientCommand } from '../update-client/commands/update-client.command.js';
import { DeleteClientCommand } from '../delete-client/commands/delete-client.command.js';
import type { ClientDto } from '../shared/dtos/client.dto.js';
import type { CreateClientDto } from '../create-client/dtos/create-client.dto.js';
import type { ListClientsDto } from '../list-clients/dtos/list-clients.dto.js';
import type { UpdateClientDto } from '../update-client/dtos/update-client.dto.js';

@Injectable()
export class ClientService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  async create(dto: CreateClientDto): Promise<ClientDto> {
    const command = new CreateClientCommand(
      dto.name,
      dto.email,
      dto.cpf,
      dto.phone
    );
    return this.commandBus.execute<CreateClientCommand, ClientDto>(command);
  }

  async list(dto: ListClientsDto = {}): Promise<PaginatedResult<ClientDto>> {
    const query = new ListClientsQuery({
      page: dto.page ?? 1,
      limit: dto.limit ?? 10,
      search: dto.search,
      sortBy: dto.sortBy ?? 'createdAt',
      sortOrder: dto.sortOrder ?? 'DESC',
    });
    return this.queryBus.execute<ListClientsQuery, PaginatedResult<ClientDto>>(query);
  }

  async getById(id: string): Promise<ClientDto> {
    const query = new GetClientQuery(id);
    return this.queryBus.execute<GetClientQuery, ClientDto>(query);
  }

  async update(id: string, dto: UpdateClientDto): Promise<ClientDto> {
    const command = new UpdateClientCommand(
      id,
      dto.name,
      dto.email,
      dto.cpf,
      dto.phone
    );
    return this.commandBus.execute<UpdateClientCommand, ClientDto>(command);
  }

  async delete(id: string): Promise<void> {
    const command = new DeleteClientCommand(id);
    return this.commandBus.execute<DeleteClientCommand, void>(command);
  }
}
