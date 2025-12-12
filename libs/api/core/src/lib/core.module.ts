import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/database/database.module.js';
import { LoggerModule } from './infrastructure/logger/logger.module.js';
import { MetricsModule } from './infrastructure/metrics/metrics.module.js';

/**
 * CoreModule
 * Módulo global que fornece infraestrutura compartilhada
 */
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    LoggerModule,
    MetricsModule,
  ],
  exports: [DatabaseModule, LoggerModule, MetricsModule],
})
export class CoreModule {}
