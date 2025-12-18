import { apiClient } from '@teddy-monorepo/web/core';
import { API_ENDPOINTS } from '@teddy-monorepo/web/core';
import type {
  DashboardStatsDto,
  LatestClientDto,
  ChartDataDto,
  LatestClientsApiResponse,
  ChartDataApiResponse,
} from '../../application/dtos/dashboard.dto';

export class DashboardRepository {
  async getStats(): Promise<DashboardStatsDto> {
    const response = await apiClient.get<DashboardStatsDto>(
      API_ENDPOINTS.DASHBOARD.STATS
    );
    return response.data;
  }

  async getLatestClients(limit = 5): Promise<LatestClientDto[]> {
    const response = await apiClient.get<LatestClientsApiResponse>(
      API_ENDPOINTS.DASHBOARD.LATEST,
      { params: { limit } }
    );
    return response.data.clients;
  }

  async getChartData(): Promise<ChartDataDto[]> {
    const response = await apiClient.get<ChartDataApiResponse>(
      API_ENDPOINTS.DASHBOARD.CHART
    );
    const { labels, data } = response.data;
    return labels.map((month, i) => ({ month, clients: data[i] }));
  }
}

export const dashboardRepository = new DashboardRepository();
