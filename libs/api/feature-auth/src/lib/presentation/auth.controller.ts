import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ZodValidationPipe, Public, CurrentUser } from '@teddy-monorepo/api/core';
import { LoginCommand } from '../application/login/commands/login.command.js';
import { ValidateTokenQuery } from '../application/validate-token/queries/validate-token.query.js';
import type { LoginDto } from '../application/login/dtos/login.dto.js';
import { LoginDtoSchema } from '../application/login/dtos/login.dto.js';
import type { AuthResponseDto } from '../application/shared/dtos/auth-response.dto.js';
import { JwtAuthGuard } from '../infrastructure/jwt/jwt-auth.guard.js';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ 
    status: 200, 
    description: 'User logged in successfully'
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body(new ZodValidationPipe(LoginDtoSchema)) loginDto: LoginDto
  ): Promise<AuthResponseDto> {
    const command = new LoginCommand(loginDto.email, loginDto.password);
    return this.commandBus.execute(command);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'Current user data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCurrentUser(@CurrentUser('id') userId: string) {
    const query = new ValidateTokenQuery(userId);
    return this.queryBus.execute(query);
  }
}
