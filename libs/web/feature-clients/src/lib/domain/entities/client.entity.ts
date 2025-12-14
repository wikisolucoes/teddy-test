/**
 * Client Entity - Entidade de domínio para Cliente
 * Representa a estrutura de um cliente no sistema
 */

export interface ClientEntity {
  id: string;
  name: string;
  salary: number;
  companyValuation: number;
  createdAt: string;
  updatedAt: string;
}
