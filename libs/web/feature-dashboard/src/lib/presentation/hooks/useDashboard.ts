/**
 * useDashboard Hook - Hook customizado para gerenciar estado do dashboard
 * Seguindo padrões de React Hooks e gerenciamento de estado
 */

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

/**
 * Hook para gerenciar dados e estado do dashboard
 * @returns Estado do dashboard e função de refetch
 */
export function useDashboard(): UseDashboardReturn {
  const [state, setState] = useState<UseDashboardState>({
    stats: null,
    latestClients: [],
    chartData: [],
    loading: true,
    error: null,
  });

  /**
   * Busca todos os dados do dashboard
   */
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

  /**
   * Carrega dados na montagem do componente
   */
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    ...state,
    refetch: fetchDashboardData,
  };
}
