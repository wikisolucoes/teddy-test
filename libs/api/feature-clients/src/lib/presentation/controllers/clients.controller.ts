import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ZodValidationPipe } from '@teddy-monorepo/api/core';
import { JwtAuthGuard } from '@teddy-monorepo/api/feature-auth';
import { ClientService } from '../../application/services/client.service.js';
import {
  CreateClientSchema,
  type CreateClientDto,
} from '../../application/create-client/dtos/create-client.dto.js';
import {
  ListClientsSchema,
  type ListClientsDto,
} from '../../application/list-clients/dtos/list-clients.dto.js';
import {
  UpdateClientSchema,
  type UpdateClientDto,
} from '../../application/update-client/dtos/update-client.dto.js';

@ApiTags('Clients')
@Controller('clients')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ClientsController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'email', 'cpf', 'phone'],
      properties: {
        name: { type: 'string', example: 'João Silva', description: 'Client name (3-100 characters)' },
        email: { type: 'string', format: 'email', example: 'joao.silva@example.com', description: 'Client email address' },
        cpf: { type: 'string', example: '123.456.789-09', description: 'CPF in format XXX.XXX.XXX-XX or 11 digits' },
        phone: { type: 'string', example: '(11) 98765-4321', description: 'Brazilian phone number' },
      },
    },
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Client created successfully'
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Email or CPF already in use' })
  async create(
    @Body(new ZodValidationPipe(CreateClientSchema)) dto: CreateClientDto
  ) {
    return this.clientService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all clients with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name', 'email', 'createdAt', 'accessCount'],
  })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  @ApiResponse({ 
    status: 200, 
    description: 'Clients list retrieved successfully'
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async list(@Query(new ZodValidationPipe(ListClientsSchema)) dto: ListClientsDto) {
    return this.clientService.list(dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get client by ID',
    description: 'Retrieves a client and increments their access count',
  })
  @ApiParam({
    name: 'id',
    description: 'Client ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 200, description: 'Client retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async getById(@Param('id') id: string) {
    return this.clientService.getById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a client' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'João Silva', description: 'Client name (3-100 characters)' },
        email: { type: 'string', format: 'email', example: 'joao.silva@example.com', description: 'Client email address' },
        cpf: { type: 'string', example: '123.456.789-09', description: 'CPF in format XXX.XXX.XXX-XX or 11 digits' },
        phone: { type: 'string', example: '(11) 98765-4321', description: 'Brazilian phone number' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'Client ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 200, description: 'Client updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiResponse({ status: 409, description: 'Email or CPF already in use' })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateClientSchema)) dto: UpdateClientDto
  ) {
    return this.clientService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a client (soft delete)' })
  @ApiParam({
    name: 'id',
    description: 'Client ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 204, description: 'Client deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.clientService.delete(id);
  }
}
