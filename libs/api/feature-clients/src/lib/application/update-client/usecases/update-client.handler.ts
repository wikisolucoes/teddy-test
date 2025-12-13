import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { UpdateClientCommand } from '../commands/update-client.command.js';
import { ClientRepository } from '../../ports/client.repository.js';
import { Client } from '../../../domain/entities/client.entity.js';
import { CPF } from '../../../domain/value-objects/cpf.vo.js';
import { Phone } from '../../../domain/value-objects/phone.vo.js';
import type { ClientDto } from '../../shared/dtos/client.dto.js';

@CommandHandler(UpdateClientCommand)
export class UpdateClientHandler implements ICommandHandler<UpdateClientCommand, ClientDto> {
  constructor(
    @Inject(ClientRepository)
    private readonly clientRepository: ClientRepository
  ) {}

  async execute(command: UpdateClientCommand): Promise<ClientDto> {
    const existing = await this.clientRepository.findById(command.id);
    if (!existing) {
      throw new NotFoundException('Client not found');
    }

    let cpfValue = existing.cpf;
    if (command.cpf) {
      const cpf = new CPF(command.cpf);
      cpfValue = cpf.getValue();

      if (cpfValue !== existing.cpf) {
        const existingByCpf = await this.clientRepository.findByCpf(cpfValue);
        if (existingByCpf && existingByCpf.id !== command.id) {
          throw new ConflictException('CPF already in use');
        }
      }
    }
    
    let phoneValue = existing.phone;
    if (command.phone) {
      const phone = new Phone(command.phone);
      phoneValue = phone.getValue();
    }

    if (command.email && command.email !== existing.email) {
      const existingByEmail = await this.clientRepository.findByEmail(command.email);
      if (existingByEmail && existingByEmail.id !== command.id) {
        throw new ConflictException('Email already in use');
      }
    }

    const updated = new Client(
      command.name ?? existing.name,
      command.email ?? existing.email,
      cpfValue,
      phoneValue,
      existing.accessCount,
      existing.id,
      existing.createdAt,
      new Date(),
      existing.deletedAt
    );
    
    const saved = await this.clientRepository.save(updated);
    
    return {
      id: saved.id,
      name: saved.name,
      email: saved.email,
      cpf: new CPF(saved.cpf).getFormattedValue(),
      phone: new Phone(saved.phone).getFormattedValue(),
      accessCount: saved.accessCount,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  }
}
