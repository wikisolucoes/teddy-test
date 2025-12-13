// Module
export { FeatureClientsModule } from './lib/feature-clients.module.js';

// Domain
export { Client } from './lib/domain/entities/client.entity.js';
export { CPF } from './lib/domain/value-objects/cpf.vo.js';
export { Phone } from './lib/domain/value-objects/phone.vo.js';

// Application - Ports
export { ClientRepository } from './lib/application/ports/client.repository.js';

// Application - DTOs
export {
  type ClientDto,
} from './lib/application/shared/dtos/client.dto.js';
export {
  CreateClientSchema,
  type CreateClientDto,
} from './lib/application/create-client/dtos/create-client.dto.js';
export {
  ListClientsSchema,
  type ListClientsDto,
} from './lib/application/list-clients/dtos/list-clients.dto.js';
export {
  UpdateClientSchema,
  type UpdateClientDto,
} from './lib/application/update-client/dtos/update-client.dto.js';

// Application - Service
export { ClientService } from './lib/application/services/client.service.js';
