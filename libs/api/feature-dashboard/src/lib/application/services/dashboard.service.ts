import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetDashboardStatsQuery } from '../get-dashboard-stats/queries/get-dashboard-stats.query.js';
import { GetLatestClientsQuery } from '../get-latest-clients/queries/get-latest-clients.query.js';
import { GetClientsChartDataQuery } from '../get-clients-chart-data/queries/get-clients-chart-data.query.js';
import type { DashboardStatsDto } from '../get-dashboard-stats/dtos/dashboard-stats.dto.js';
import type { LatestClientsDto } from '../get-latest-clients/dtos/latest-clients.dto.js';
import type { ClientsChartDataDto } from '../get-clients-chart-data/dtos/clients-chart-data.dto.js';

@Injectable()
export class DashboardService {
  constructor(private readonly queryBus: QueryBus) {}

  async getStats(): Promise<DashboardStatsDto> {
    const query = new GetDashboardStatsQuery();
    return this.queryBus.execute<GetDashboardStatsQuery, DashboardStatsDto>(query);
  }

  async getLatestClients(limit?: number): Promise<LatestClientsDto> {
    const query = new GetLatestClientsQuery(limit);
    return this.queryBus.execute<GetLatestClientsQuery, LatestClientsDto>(query);
  }

  async getChartData(months?: number): Promise<ClientsChartDataDto> {
    const query = new GetClientsChartDataQuery(months);
    return this.queryBus.execute<GetClientsChartDataQuery, ClientsChartDataDto>(query);
  }
}
