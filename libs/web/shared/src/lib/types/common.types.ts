/**
 * Common Types - Tipos compartilhados entre features
 */

/**
 * Resposta paginada da API
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Metadados de paginação
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Resposta padrão da API
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Erro da API
 */
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

/**
 * Estado de loading genérico
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Props de componentes que aceitam className
 */
export interface ClassNameProps {
  className?: string;
}

/**
 * Props de componentes que aceitam children
 */
export interface ChildrenProps {
  children: React.ReactNode;
}
