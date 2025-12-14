/**
 * useSelectedClients Hook - Hook para gerenciar clientes selecionados
 * Usa localStorage para persistir seleção
 */

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

/**
 * Hook para gerenciar clientes selecionados
 * Persiste no localStorage
 */
export function useSelectedClients(): UseSelectedClientsReturn {
  const [selectedClients, setSelectedClients] = useState<ClientResponseDto[]>(() => {
    // Carrega do localStorage na inicialização
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

  /**
   * Sincroniza com localStorage sempre que mudar
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedClients));
    }
  }, [selectedClients]);

  /**
   * Adiciona um cliente à seleção
   */
  const addClient = (client: ClientResponseDto) => {
    setSelectedClients(prev => {
      // Evita duplicatas
      if (prev.some(c => c.id === client.id)) {
        return prev;
      }
      return [...prev, client];
    });
  };

  /**
   * Remove um cliente da seleção
   */
  const removeClient = (clientId: string) => {
    setSelectedClients(prev => prev.filter(c => c.id !== clientId));
  };

  /**
   * Limpa todos os clientes selecionados
   */
  const clearAll = () => {
    setSelectedClients([]);
  };

  /**
   * Verifica se um cliente está selecionado
   */
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
