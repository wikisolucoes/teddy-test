import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ZodValidationPipe, Public, CurrentUser } from '@teddy-monorepo/api/core';
import type { LoginDto } from '../application/login/dtos/login.dto.js';
import { LoginDtoSchema } from '../application/login/dtos/login.dto.js';
import type { AuthResponseDto } from '../application/shared/dtos/auth-response.dto.js';
import { JwtAuthGuard } from '../infrastructure/jwt/jwt-auth.guard.js';
import { AuthService } from '../application/services/auth.service.js';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Public()
  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ 
    summary: 'User login',
    description: 'Authenticate user with email and password' 
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email', example: 'admin@teddydigital.io', description: 'User email address' },
        password: { type: 'string', example: 'admin123', description: 'User password (minimum 6 characters)' },
      },
    },
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User logged in successfully'
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body(new ZodValidationPipe(LoginDtoSchema)) loginDto: LoginDto
  ): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get current authenticated user',
    description: 'Returns the profile of the currently authenticated user'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Current user data retrieved successfully'
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  async getCurrentUser(@CurrentUser('id') userId: string) {
    return this.authService.validateToken(userId);
  }
}
