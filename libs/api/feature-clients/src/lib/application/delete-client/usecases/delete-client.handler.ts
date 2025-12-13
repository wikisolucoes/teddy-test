import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException, Inject } from '@nestjs/common';
import type { Logger } from 'winston';
import { DeleteClientCommand } from '../commands/delete-client.command.js';
import { ClientRepository } from '../../ports/client.repository.js';

@CommandHandler(DeleteClientCommand)
export class DeleteClientHandler implements ICommandHandler<DeleteClientCommand, void> {
  constructor(
    @Inject(ClientRepository)
    private readonly clientRepository: ClientRepository,
    @Inject('winston')
    private readonly logger: Logger
  ) {}

  async execute(command: DeleteClientCommand): Promise<void> {
    const client = await this.clientRepository.findById(command.id);
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    
    await this.clientRepository.softDelete(command.id);
    
    this.logger.info('Client deleted (soft)', { clientId: command.id });
  }
}
