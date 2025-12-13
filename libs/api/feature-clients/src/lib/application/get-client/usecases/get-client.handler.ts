import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';
import { NotFoundException, Inject } from '@nestjs/common';
import { GetClientQuery } from '../queries/get-client.query.js';
import { ClientRepository } from '../../ports/client.repository.js';
import { CPF } from '../../../domain/value-objects/cpf.vo.js';
import { Phone } from '../../../domain/value-objects/phone.vo.js';
import type { ClientDto } from '../../shared/dtos/client.dto.js';

@QueryHandler(GetClientQuery)
export class GetClientHandler implements IQueryHandler<GetClientQuery, ClientDto> {
  constructor(
    @Inject(ClientRepository)
    private readonly clientRepository: ClientRepository
  ) {}

  async execute(query: GetClientQuery): Promise<ClientDto> {
    const client = await this.clientRepository.findById(query.id);
    
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    
    await this.clientRepository.incrementAccessCount(query.id);
    
    return {
      id: client.id,
      name: client.name,
      email: client.email,
      cpf: new CPF(client.cpf).getFormattedValue(),
      phone: new Phone(client.phone).getFormattedValue(),
      accessCount: client.accessCount + 1,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
