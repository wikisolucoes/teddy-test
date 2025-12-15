import { apiClient } from '@teddy-monorepo/web/core';
import { API_ENDPOINTS } from '@teddy-monorepo/web/core';
import type {
  DashboardStatsDto,
  LatestClientDto,
  ChartDataDto,
} from '../../application/dtos/dashboard.dto';

export class DashboardRepository {
  async getStats(): Promise<DashboardStatsDto> {
    const response = await apiClient.get<DashboardStatsDto>(
      API_ENDPOINTS.DASHBOARD.STATS
    );
    return response.data;
  }

  async getLatestClients(limit = 5): Promise<LatestClientDto[]> {
    const response = await apiClient.get<LatestClientDto[]>(
      API_ENDPOINTS.DASHBOARD.LATEST,
      { params: { limit } }
    );
    return response.data;
  }

  async getChartData(): Promise<ChartDataDto[]> {
    const response = await apiClient.get<ChartDataDto[]>(
      API_ENDPOINTS.DASHBOARD.CHART
    );
    return response.data;
  }
}

export const dashboardRepository = new DashboardRepository();
