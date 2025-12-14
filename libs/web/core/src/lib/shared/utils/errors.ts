import { AxiosError } from 'axios';

/**
 * Extrai mensagem de erro de uma exceção
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    // Tenta pegar mensagem do response
    if (error.response?.data?.message) {
      return Array.isArray(error.response.data.message)
        ? error.response.data.message.join(', ')
        : error.response.data.message;
    }
    
    // Mensagem padrão baseada no status
    if (error.response?.status === 401) {
      return 'Não autorizado. Faça login novamente.';
    }
    if (error.response?.status === 403) {
      return 'Acesso negado.';
    }
    if (error.response?.status === 404) {
      return 'Recurso não encontrado.';
    }
    if (error.response?.status === 500) {
      return 'Erro interno do servidor. Tente novamente mais tarde.';
    }
    
    return error.message || 'Erro ao processar requisição.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocorreu um erro inesperado.';
}

/**
 * Trata erros da API e exibe mensagem apropriada
 */
export function handleApiError(error: unknown): string {
  const message = getErrorMessage(error);
  // Aqui poderia integrar com um sistema de toast/notificação
  console.error('API Error:', message);
  return message;
}

