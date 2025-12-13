import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LoginCommand } from '../login/commands/login.command.js';
import { ValidateTokenQuery } from '../validate-token/queries/validate-token.query.js';
import type { LoginDto } from '../login/dtos/login.dto.js';
import type { AuthResponseDto } from '../shared/dtos/auth-response.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const command = new LoginCommand(dto.email, dto.password);
    return this.commandBus.execute<LoginCommand, AuthResponseDto>(command);
  }

  async validateToken(userId: string): Promise<{
    id: string;
    name: string;
    email: string;
    isActive: boolean;
  }> {
    const query = new ValidateTokenQuery(userId);
    return this.queryBus.execute(query);
  }
}
