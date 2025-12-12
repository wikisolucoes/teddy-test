// Module
export * from './lib/feature-auth.module.js';

// Domain
export * from './lib/domain/entities/user.entity.js';
export * from './lib/domain/value-objects/email.vo.js';
export * from './lib/domain/repositories/user.repository.interface.js';

// Infrastructure
export * from './lib/infrastructure/persistence/typeorm/user.schema.js';
export * from './lib/infrastructure/persistence/typeorm/user.repository.js';
export * from './lib/infrastructure/jwt/jwt.strategy.js';
export * from './lib/infrastructure/jwt/jwt-auth.guard.js';

// Application
export * from './lib/application/login/commands/login.command.js';
export * from './lib/application/login/handlers/login.handler.js';
export * from './lib/application/login/dtos/login.dto.js';
export * from './lib/application/validate-token/queries/validate-token.query.js';
export * from './lib/application/validate-token/handlers/validate-token.handler.js';
export * from './lib/application/shared/dtos/auth-response.dto.js';

// Presentation
export * from './lib/presentation/auth.controller.js';
