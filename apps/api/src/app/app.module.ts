import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import {
  DatabaseModule,
  LoggerModule,
  MetricsModule,
} from '@teddy-monorepo/api/core';

import { FeatureAuthModule } from '@teddy-monorepo/api/feature-auth';
import { FeatureClientsModule } from '@teddy-monorepo/api/feature-clients';
import { FeatureDashboardModule } from '@teddy-monorepo/api/feature-dashboard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Core Infrastructure
    DatabaseModule,
    LoggerModule,
    MetricsModule,

    // Feature Modules
    FeatureAuthModule,
    FeatureClientsModule,
    FeatureDashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
