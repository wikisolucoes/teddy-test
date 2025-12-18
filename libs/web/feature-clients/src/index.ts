// Domain
export * from './lib/domain/entities/client.entity';
export * from './lib/domain/repositories/client.repository.interface';

// Application
export * from './lib/application/dtos/client.dto';
export * from './lib/application/services/client.service';

// Infrastructure
export * from './lib/infrastructure/api/repositories/client.repository';

// Presentation - Hooks
export * from './lib/presentation/hooks/useClients';
export * from './lib/presentation/hooks/useSelectedClients';

// Presentation - Components
export * from './lib/presentation/components/cards/ClientCard';
export * from './lib/presentation/components/forms/ClientForm';
export * from './lib/presentation/components/modals/ClientFormDialog';
export * from './lib/presentation/components/modals/ConfirmDeleteDialog';

// Presentation - Pages
export * from './lib/presentation/pages/Clients';
export * from './lib/presentation/pages/ClientsSelected';

