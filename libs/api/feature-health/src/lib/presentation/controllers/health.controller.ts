import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
  HealthCheckResult,
} from '@nestjs/terminus';
import { HealthConfig } from '../../config/health.config.js';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly healthConfig: HealthConfig
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Health check endpoint',
    description: 'Returns the health status of the application and its dependencies',
  })
  @ApiResponse({
    status: 200,
    description: 'Application is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        info: {
          type: 'object',
          properties: {
            'database-write': {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'up' },
              },
            },
            'database-read': {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'up' },
              },
            },
            'memory-heap': {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'up' },
              },
            },
            'memory-rss': {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'up' },
              },
            },
            'storage': {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'up' },
              },
            },
          },
        },
        error: { type: 'object' },
        details: { type: 'object' },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Application is unhealthy',
  })
  async check(): Promise<HealthCheckResult> {
    return this.health.check([
      // Database health checks
      () => this.db.pingCheck('database-write', { connection: 'write' }),
      () => this.db.pingCheck('database-read', { connection: 'read' }),
      
      // Memory health checks
      () => this.memory.checkHeap('memory-heap', this.healthConfig.memoryThresholdBytes),
      () => this.memory.checkRSS('memory-rss', this.healthConfig.memoryThresholdBytes),
      
      // Disk health check
      () => this.disk.checkStorage('storage', { 
        path: '/', 
        thresholdPercent: this.healthConfig.diskThresholdPercent 
      }),
    ]);
  }
}
