import { dashboardRepository } from '../../infrastructure/api/repositories/dashboard.repository';
import type {
  DashboardStatsDto,
  LatestClientDto,
  ChartDataDto,
} from '../dtos/dashboard.dto';

export class DashboardService {
  async getStats(): Promise<DashboardStatsDto> {
    try {
      return await dashboardRepository.getStats();
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  async getLatestClients(limit = 5): Promise<LatestClientDto[]> {
    try {
      return await dashboardRepository.getLatestClients(limit);
    } catch (error) {
      console.error('Error fetching latest clients:', error);
      throw error;
    }
  }

  async getChartData(): Promise<ChartDataDto[]> {
    try {
      return await dashboardRepository.getChartData();
    } catch (error) {
      console.error('Error fetching chart data:', error);
      throw error;
    }
  }

  async getAllDashboardData() {
    try {
      const [stats, latestClients, chartData] = await Promise.all([
        this.getStats(),
        this.getLatestClients(),
        this.getChartData(),
      ]);

      return {
        stats,
        latestClients,
        chartData,
      };
    } catch (error) {
      console.error('Error fetching all dashboard data:', error);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();
