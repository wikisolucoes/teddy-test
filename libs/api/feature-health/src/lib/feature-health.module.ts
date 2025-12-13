import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { MetricsModule } from '@teddy-monorepo/api/core';
import { HealthController } from './presentation/controllers/health.controller.js';
import { MetricsController } from './presentation/controllers/metrics.controller.js';

@Module({
  imports: [
    TerminusModule,
    MetricsModule,
  ],
  controllers: [HealthController, MetricsController],
  providers: [],
  exports: [],
})
export class FeatureHealthModule {}
