import { Module, Global } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrometheusService } from './prometheus.service.js';
import { MetricsInterceptor } from './metrics.interceptor.js';

@Global()
@Module({
  providers: [
    PrometheusService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
  exports: [PrometheusService],
})
export class MetricsModule {}
