import { useState, useEffect } from 'react';
import type { ClientResponseDto } from '../../application/dtos/client.dto';

const STORAGE_KEY = 'selectedClients';

interface UseSelectedClientsReturn {
  selectedClients: ClientResponseDto[];
  addClient: (client: ClientResponseDto) => void;
  removeClient: (clientId: string) => void;
  clearAll: () => void;
  isSelected: (clientId: string) => boolean;
  count: number;
}

export function useSelectedClients(): UseSelectedClientsReturn {
  const [selectedClients, setSelectedClients] = useState<ClientResponseDto[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedClients));
    }
  }, [selectedClients]);

  const addClient = (client: ClientResponseDto) => {
    setSelectedClients(prev => {
      if (prev.some(c => c.id === client.id)) {
        return prev;
      }
      return [...prev, client];
    });
  };

  const removeClient = (clientId: string) => {
    setSelectedClients(prev => prev.filter(c => c.id !== clientId));
  };

  const clearAll = () => {
    setSelectedClients([]);
  };

  const isSelected = (clientId: string): boolean => {
    return selectedClients.some(c => c.id === clientId);
  };

  return {
    selectedClients,
    addClient,
    removeClient,
    clearAll,
    isSelected,
    count: selectedClients.length,
  };
}
