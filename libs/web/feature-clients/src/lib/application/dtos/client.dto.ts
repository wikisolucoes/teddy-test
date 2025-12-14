/**
 * Client DTOs - Data Transfer Objects para operações de clientes
 * Define a estrutura de dados para comunicação com a API
 */

/**
 * DTO para criação de cliente
 */
export interface CreateClientDto {
  name: string;
  salary: number;
  companyValuation: number;
}

/**
 * DTO para atualização de cliente
 */
export interface UpdateClientDto {
  name?: string;
  salary?: number;
  companyValuation?: number;
}

/**
 * DTO para resposta de cliente da API
 */
export interface ClientResponseDto {
  id: string;
  name: string;
  salary: number;
  companyValuation: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO para resposta paginada de clientes
 */
export interface PaginatedClientsDto {
  data: ClientResponseDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
