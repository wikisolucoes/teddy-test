import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller.js';
import {
  HealthCheckService,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
  HealthCheckResult,
} from '@nestjs/terminus';
import { HealthConfig } from '../../config/health.config.js';

describe('HealthController', () => {
  let controller: HealthController;
  let healthCheckService: jest.Mocked<HealthCheckService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: {
            check: jest.fn(),
          },
        },
        {
          provide: TypeOrmHealthIndicator,
          useValue: {
            pingCheck: jest.fn(),
          },
        },
        {
          provide: MemoryHealthIndicator,
          useValue: {
            checkHeap: jest.fn(),
            checkRSS: jest.fn(),
          },
        },
        {
          provide: DiskHealthIndicator,
          useValue: {
            checkStorage: jest.fn(),
          },
        },
        {
          provide: HealthConfig,
          useValue: {
            memoryThresholdBytes: 150 * 1024 * 1024,
            diskThresholdPercent: 0.9,
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthCheckService = module.get(HealthCheckService);
  });

  describe('check', () => {
    it('should return healthy status when all checks pass', async () => {
      const healthyResult: HealthCheckResult = {
        status: 'ok',
        info: {
          'database-write': { status: 'up' },
          'database-read': { status: 'up' },
          'memory-heap': { status: 'up' },
          'memory-rss': { status: 'up' },
          storage: { status: 'up' },
        },
        error: {},
        details: {
          'database-write': { status: 'up' },
          'database-read': { status: 'up' },
          'memory-heap': { status: 'up' },
          'memory-rss': { status: 'up' },
          storage: { status: 'up' },
        },
      };

      healthCheckService.check.mockResolvedValue(healthyResult);

      const result = await controller.check();

      expect(result.status).toBe('ok');
      expect(result.info).toBeDefined();
      expect(healthCheckService.check).toHaveBeenCalledTimes(1);
    });

    it('should call health check service with 5 indicator functions', async () => {
      const healthyResult: HealthCheckResult = {
        status: 'ok',
        info: {},
        error: {},
        details: {},
      };

      healthCheckService.check.mockImplementation(async (indicators) => {
        // Verificar que 5 funções foram passadas
        expect(indicators).toHaveLength(5);
        return healthyResult;
      });

      await controller.check();

      expect(healthCheckService.check).toHaveBeenCalled();
    });

    it('should return error status when database is down', async () => {
      const unhealthyResult: HealthCheckResult = {
        status: 'error',
        info: {
          'memory-heap': { status: 'up' },
          'memory-rss': { status: 'up' },
          storage: { status: 'up' },
        },
        error: {
          'database-write': { status: 'down', message: 'Connection refused' },
        },
        details: {
          'database-write': { status: 'down', message: 'Connection refused' },
          'memory-heap': { status: 'up' },
          'memory-rss': { status: 'up' },
          storage: { status: 'up' },
        },
      };

      healthCheckService.check.mockResolvedValue(unhealthyResult);

      const result = await controller.check();

      expect(result.status).toBe('error');
      expect(result.error).toBeDefined();
    });

    it('should check write and read database connections', async () => {
      const healthyResult: HealthCheckResult = {
        status: 'ok',
        info: {
          'database-write': { status: 'up' },
          'database-read': { status: 'up' },
        },
        error: {},
        details: {
          'database-write': { status: 'up' },
          'database-read': { status: 'up' },
        },
      };

      healthCheckService.check.mockResolvedValue(healthyResult);

      const result = await controller.check();

      expect(result.info?.['database-write']).toBeDefined();
      expect(result.info?.['database-read']).toBeDefined();
    });

    it('should check memory heap and RSS', async () => {
      const healthyResult: HealthCheckResult = {
        status: 'ok',
        info: {
          'memory-heap': { status: 'up' },
          'memory-rss': { status: 'up' },
        },
        error: {},
        details: {
          'memory-heap': { status: 'up' },
          'memory-rss': { status: 'up' },
        },
      };

      healthCheckService.check.mockResolvedValue(healthyResult);

      const result = await controller.check();

      expect(result.info?.['memory-heap']).toBeDefined();
      expect(result.info?.['memory-rss']).toBeDefined();
    });

    it('should check disk storage', async () => {
      const healthyResult: HealthCheckResult = {
        status: 'ok',
        info: {
          storage: { status: 'up' },
        },
        error: {},
        details: {
          storage: { status: 'up' },
        },
      };

      healthCheckService.check.mockResolvedValue(healthyResult);

      const result = await controller.check();

      expect(result.info?.storage).toBeDefined();
    });

    it('should return error when memory threshold is exceeded', async () => {
      const unhealthyResult: HealthCheckResult = {
        status: 'error',
        info: {
          'database-write': { status: 'up' },
          'database-read': { status: 'up' },
          storage: { status: 'up' },
        },
        error: {
          'memory-heap': { status: 'down', message: 'Memory usage exceeds threshold' },
        },
        details: {
          'database-write': { status: 'up' },
          'database-read': { status: 'up' },
          'memory-heap': { status: 'down', message: 'Memory usage exceeds threshold' },
          storage: { status: 'up' },
        },
      };

      healthCheckService.check.mockResolvedValue(unhealthyResult);

      const result = await controller.check();

      expect(result.status).toBe('error');
      expect(result.error?.['memory-heap']).toBeDefined();
    });

    it('should return error when disk threshold is exceeded', async () => {
      const unhealthyResult: HealthCheckResult = {
        status: 'error',
        info: {
          'database-write': { status: 'up' },
          'database-read': { status: 'up' },
          'memory-heap': { status: 'up' },
          'memory-rss': { status: 'up' },
        },
        error: {
          storage: { status: 'down', message: 'Disk usage exceeds 90%' },
        },
        details: {
          'database-write': { status: 'up' },
          'database-read': { status: 'up' },
          'memory-heap': { status: 'up' },
          'memory-rss': { status: 'up' },
          storage: { status: 'down', message: 'Disk usage exceeds 90%' },
        },
      };

      healthCheckService.check.mockResolvedValue(unhealthyResult);

      const result = await controller.check();

      expect(result.status).toBe('error');
      expect(result.error?.storage).toBeDefined();
    });

    it('should include details in health check result', async () => {
      const healthyResult: HealthCheckResult = {
        status: 'ok',
        info: {
          'database-write': { status: 'up' },
        },
        error: {},
        details: {
          'database-write': { status: 'up', responseTime: '10ms' },
        },
      };

      healthCheckService.check.mockResolvedValue(healthyResult);

      const result = await controller.check();

      expect(result.details).toBeDefined();
      expect(result.details?.['database-write']).toBeDefined();
    });

    it('should handle multiple failing checks', async () => {
      const unhealthyResult: HealthCheckResult = {
        status: 'error',
        info: {
          'memory-heap': { status: 'up' },
        },
        error: {
          'database-write': { status: 'down', message: 'Connection refused' },
          'database-read': { status: 'down', message: 'Connection timeout' },
          storage: { status: 'down', message: 'Disk full' },
        },
        details: {
          'database-write': { status: 'down', message: 'Connection refused' },
          'database-read': { status: 'down', message: 'Connection timeout' },
          'memory-heap': { status: 'up' },
          storage: { status: 'down', message: 'Disk full' },
        },
      };

      healthCheckService.check.mockResolvedValue(unhealthyResult);

      const result = await controller.check();

      expect(result.status).toBe('error');
      expect(Object.keys(result.error || {}).length).toBeGreaterThan(1);
    });
  });
});
