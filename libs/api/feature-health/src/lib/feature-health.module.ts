import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { getDataSourceToken } from '@nestjs/typeorm';
import { MetricsModule, DatabaseModule } from '@teddy-monorepo/api/core';
import { HealthController } from './presentation/controllers/health.controller.js';
import { MetricsController } from './presentation/controllers/metrics.controller.js';
import { HealthConfig } from './config/health.config.js';

@Module({
  imports: [
    TerminusModule,
    MetricsModule,
    DatabaseModule,
  ],
  controllers: [HealthController, MetricsController],
  providers: [
    HealthConfig,
    {
      provide: 'WRITE_DATA_SOURCE',
      useExisting: getDataSourceToken('write'),
    },
    {
      provide: 'READ_DATA_SOURCE',
      useExisting: getDataSourceToken('read'),
    },
  ],
  exports: [],
})
export class FeatureHealthModule {}
