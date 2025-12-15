import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../../application/services/dashboard.service';
import type {
  DashboardStatsDto,
  LatestClientDto,
  ChartDataDto,
} from '../../application/dtos/dashboard.dto';

interface UseDashboardState {
  stats: DashboardStatsDto | null;
  latestClients: LatestClientDto[];
  chartData: ChartDataDto[];
  loading: boolean;
  error: string | null;
}

interface UseDashboardReturn extends UseDashboardState {
  refetch: () => Promise<void>;
}

export function useDashboard(): UseDashboardReturn {
  const [state, setState] = useState<UseDashboardState>({
    stats: null,
    latestClients: [],
    chartData: [],
    loading: true,
    error: null,
  });

  const fetchDashboardData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await dashboardService.getAllDashboardData();
      
      setState({
        stats: data.stats,
        latestClients: data.latestClients,
        chartData: data.chartData,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao carregar dados do dashboard';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    ...state,
    refetch: fetchDashboardData,
  };
}
