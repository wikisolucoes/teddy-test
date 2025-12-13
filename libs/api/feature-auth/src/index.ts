// Module
export * from './lib/feature-auth.module.js';

// Domain
export * from './lib/domain/entities/user.entity.js';
export * from './lib/domain/value-objects/email.vo.js';

// Application Ports
export * from './lib/application/ports/user.repository.js';

// Application Services
export * from './lib/application/services/auth.service.js';

// Infrastructure
export * from './lib/infrastructure/persistence/typeorm/schemas/user.schema.js';
export * from './lib/infrastructure/persistence/typeorm/repositories/user.repository.js';
export * from './lib/infrastructure/jwt/jwt.strategy.js';
export * from './lib/infrastructure/jwt/jwt-auth.guard.js';

// Application - CQRS
export * from './lib/application/login/commands/login.command.js';
export * from './lib/application/login/usecases/login.handler.js';
export * from './lib/application/login/dtos/login.dto.js';
export * from './lib/application/validate-token/queries/validate-token.query.js';
export * from './lib/application/validate-token/usecases/validate-token.handler.js';
export * from './lib/application/shared/dtos/auth-response.dto.js';

// Presentation
export * from './lib/presentation/auth.controller.js';
