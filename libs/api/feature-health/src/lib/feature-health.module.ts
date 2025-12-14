import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { MetricsModule } from '@teddy-monorepo/api/core';
import { HealthController } from './presentation/controllers/health.controller.js';
import { MetricsController } from './presentation/controllers/metrics.controller.js';
import { HealthConfig } from './config/health.config.js';

@Module({
  imports: [
    TerminusModule,
    MetricsModule,
  ],
  controllers: [HealthController, MetricsController],
  providers: [HealthConfig],
  exports: [],
})
export class FeatureHealthModule {}
