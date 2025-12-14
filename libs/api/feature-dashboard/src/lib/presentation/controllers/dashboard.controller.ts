import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ZodValidationPipe } from '@teddy-monorepo/api/core';
import { JwtAuthGuard } from '@teddy-monorepo/api/feature-auth';
import { DashboardService } from '../../application/services/dashboard.service.js';
import { DEFAULT_LATEST_CLIENTS_LIMIT, DEFAULT_CHART_MONTHS } from '../../application/shared/constants.js';
import {
  GetLatestClientsSchema,
  type GetLatestClientsDto,
} from '../dtos/get-latest-clients.dto.js';
import {
  GetChartDataSchema,
  type GetChartDataDto,
} from '../dtos/get-chart-data.dto.js';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({
    summary: 'Get dashboard statistics',
    description: 'Returns general statistics about clients (total, active, deleted, new this month)',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 150 },
        active: { type: 'number', example: 142 },
        deleted: { type: 'number', example: 8 },
        newThisMonth: { type: 'number', example: 23 },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Get('latest')
  @ApiOperation({
    summary: 'Get latest clients',
    description: 'Returns the most recently created clients',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of clients to return (1-100)',
    example: DEFAULT_LATEST_CLIENTS_LIMIT,
  })
  @ApiResponse({
    status: 200,
    description: 'Latest clients retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid limit parameter' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLatest(
    @Query(new ZodValidationPipe(GetLatestClientsSchema)) dto: GetLatestClientsDto
  ) {
    const limit = dto.limit ?? DEFAULT_LATEST_CLIENTS_LIMIT;
    return this.dashboardService.getLatestClients(limit);
  }

  @Get('chart')
  @ApiOperation({
    summary: 'Get clients chart data',
    description: 'Returns data for clients per month chart (last 6 months by default)',
  })
  @ApiQuery({
    name: 'months',
    required: false,
    type: Number,
    description: 'Number of months to include (1-24)',
    example: DEFAULT_CHART_MONTHS,
  })
  @ApiResponse({
    status: 200,
    description: 'Chart data retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        labels: {
          type: 'array',
          items: { type: 'string' },
          example: ['jul/2025', 'ago/2025', 'set/2025', 'out/2025', 'nov/2025', 'dez/2025'],
        },
        data: {
          type: 'array',
          items: { type: 'number' },
          example: [5, 12, 8, 15, 20, 23],
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid months parameter' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getChartData(
    @Query(new ZodValidationPipe(GetChartDataSchema)) dto: GetChartDataDto
  ) {
    const months = dto.months ?? DEFAULT_CHART_MONTHS;
    return this.dashboardService.getChartData(months);
  }
}
