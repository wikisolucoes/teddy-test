import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Inject } from '@nestjs/common';
import type { Logger } from 'winston';
import { CreateClientCommand } from '../commands/create-client.command.js';
import { ClientRepository } from '../../ports/client.repository.js';
import { Client } from '../../../domain/entities/client.entity.js';
import { CPF } from '../../../domain/value-objects/cpf.vo.js';
import { Phone } from '../../../domain/value-objects/phone.vo.js';
import type { ClientDto } from '../../shared/dtos/client.dto.js';

@CommandHandler(CreateClientCommand)
export class CreateClientHandler implements ICommandHandler<CreateClientCommand, ClientDto> {
  constructor(
    @Inject(ClientRepository)
    private readonly clientRepository: ClientRepository,
    @Inject('winston')
    private readonly logger: Logger
  ) {}

  async execute(command: CreateClientCommand): Promise<ClientDto> {
    const cpf = new CPF(command.cpf);
    const phone = new Phone(command.phone);
    
    const existingByEmail = await this.clientRepository.findByEmail(command.email);
    if (existingByEmail) {
      throw new ConflictException('Email already exists');
    }
    
    const existingByCpf = await this.clientRepository.findByCpf(cpf.getValue());
    if (existingByCpf) {
      throw new ConflictException('CPF already exists');
    }
    
    const client = new Client(
      command.name,
      command.email,
      cpf.getValue(),
      phone.getValue(),
      0 // accessCount
    );
    
    const saved = await this.clientRepository.save(client);
    
    this.logger.info('Client created', { clientId: saved.id });
    
    return {
      id: saved.id,
      name: saved.name,
      email: saved.email,
      cpf: cpf.getFormattedValue(),
      phone: phone.getFormattedValue(),
      accessCount: saved.accessCount,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  }
}
