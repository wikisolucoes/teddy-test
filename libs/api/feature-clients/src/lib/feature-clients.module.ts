import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsController } from './presentation/controllers/clients.controller.js';
import { ClientService } from './application/services/client.service.js';
import { ClientRepository } from './application/ports/client.repository.js';
import { TypeOrmClientRepository } from './infrastructure/persistence/typeorm/repositories/client.repository.js';
import { ClientSchema } from './infrastructure/persistence/typeorm/schemas/client.schema.js';
import { CreateClientHandler } from './application/create-client/usecases/create-client.handler.js';
import { UpdateClientHandler } from './application/update-client/usecases/update-client.handler.js';
import { DeleteClientHandler } from './application/delete-client/usecases/delete-client.handler.js';
import { ListClientsHandler } from './application/list-clients/usecases/list-clients.handler.js';
import { GetClientHandler } from './application/get-client/usecases/get-client.handler.js';

const CommandHandlers = [
  CreateClientHandler,
  UpdateClientHandler,
  DeleteClientHandler,
];

const QueryHandlers = [
  ListClientsHandler,
  GetClientHandler,
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([ClientSchema], 'read'),
    TypeOrmModule.forFeature([ClientSchema], 'write'),
  ],
  controllers: [ClientsController],
  providers: [
    ClientService,
    {
      provide: ClientRepository,
      useClass: TypeOrmClientRepository,
    },
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [ClientRepository, ClientService],
})
export class FeatureClientsModule {}
