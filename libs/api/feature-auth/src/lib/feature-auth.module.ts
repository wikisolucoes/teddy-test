import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from './infrastructure/persistence/typeorm/schemas/user.schema.js';
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm/repositories/user.repository.js';
import { UserRepository } from './application/ports/user.repository.js';
import { JwtStrategy } from './infrastructure/jwt/jwt.strategy.js';
import { JwtAuthGuard } from './infrastructure/jwt/jwt-auth.guard.js';
import { LoginHandler } from './application/login/usecases/login.handler.js';
import { ValidateTokenHandler } from './application/validate-token/usecases/validate-token.handler.js';
import { AuthController } from './presentation/auth.controller.js';
import { AuthService } from './application/services/auth.service.js';

const commandHandlers = [LoginHandler];
const queryHandlers = [ValidateTokenHandler];

@Module({
  imports: [
    CqrsModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'dev-secret',
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN') || '24h',
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserSchema], 'write'),
    TypeOrmModule.forFeature([UserSchema], 'read'),
  ],
  controllers: [AuthController],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    AuthService,
    {
      provide: UserRepository,
      useClass: TypeOrmUserRepository,
    },
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [JwtAuthGuard, UserRepository, AuthService],
})
export class FeatureAuthModule {}
