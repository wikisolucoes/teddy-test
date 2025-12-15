import { useState, useEffect, useCallback } from 'react';
import { clientService } from '../../application/services/client.service';
import type {
  ClientResponseDto,
  CreateClientDto,
  UpdateClientDto,
} from '../../application/dtos/client.dto';

interface UseClientsState {
  clients: ClientResponseDto[];
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}

interface UseClientsReturn extends UseClientsState {
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  createClient: (data: CreateClientDto) => Promise<ClientResponseDto>;
  updateClient: (id: string, data: UpdateClientDto) => Promise<ClientResponseDto>;
  deleteClient: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useClients(initialLimit = 16): UseClientsReturn {
  const [state, setState] = useState<UseClientsState>({
    clients: [],
    loading: true,
    error: null,
    page: 1,
    limit: initialLimit,
    totalPages: 1,
    total: 0,
  });

  const fetchClients = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await clientService.getClients(state.page, state.limit);

      setState(prev => ({
        ...prev,
        clients: response.data,
        totalPages: response.meta.totalPages,
        total: response.meta.total,
        loading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erro ao carregar clientes';

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, [state.page, state.limit]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const createClient = async (data: CreateClientDto): Promise<ClientResponseDto> => {
    const client = await clientService.createClient(data);
    await fetchClients();
    return client;
  };

  const updateClient = async (
    id: string,
    data: UpdateClientDto
  ): Promise<ClientResponseDto> => {
    const client = await clientService.updateClient(id, data);
    await fetchClients();
    return client;
  };

  const deleteClient = async (id: string): Promise<void> => {
    await clientService.deleteClient(id);
    await fetchClients();
  };

  return {
    ...state,
    setPage: (page: number) => setState(prev => ({ ...prev, page })),
    setLimit: (limit: number) => setState(prev => ({ ...prev, limit, page: 1 })),
    createClient,
    updateClient,
    deleteClient,
    refetch: fetchClients,
  };
}
