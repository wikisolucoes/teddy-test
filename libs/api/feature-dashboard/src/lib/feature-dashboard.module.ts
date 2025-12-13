import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { FeatureClientsModule } from '@teddy-monorepo/api/feature-clients';
import { DashboardController } from './presentation/controllers/dashboard.controller.js';
import { DashboardService } from './application/services/dashboard.service.js';
import { GetDashboardStatsHandler } from './application/get-dashboard-stats/usecases/get-dashboard-stats.handler.js';
import { GetLatestClientsHandler } from './application/get-latest-clients/usecases/get-latest-clients.handler.js';
import { GetClientsChartDataHandler } from './application/get-clients-chart-data/usecases/get-clients-chart-data.handler.js';

const QueryHandlers = [
  GetDashboardStatsHandler,
  GetLatestClientsHandler,
  GetClientsChartDataHandler,
];

@Module({
  imports: [
    CqrsModule,
    FeatureClientsModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService, ...QueryHandlers],
  exports: [DashboardService],
})
export class FeatureDashboardModule {}
