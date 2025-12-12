import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from './infrastructure/persistence/typeorm/user.schema.js';
import { UserRepository } from './infrastructure/persistence/typeorm/user.repository.js';
import { JwtStrategy } from './infrastructure/jwt/jwt.strategy.js';
import { JwtAuthGuard } from './infrastructure/jwt/jwt-auth.guard.js';
import { LoginHandler } from './application/login/handlers/login.handler.js';
import { ValidateTokenHandler } from './application/validate-token/handlers/validate-token.handler.js';
import { AuthController } from './presentation/auth.controller.js';

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
    TypeOrmModule.forFeature([UserSchema]),
  ],
  controllers: [AuthController],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [JwtAuthGuard, 'IUserRepository'],
})
export class FeatureAuthModule {}
