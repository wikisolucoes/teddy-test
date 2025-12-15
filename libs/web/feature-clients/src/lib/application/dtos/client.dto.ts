export interface CreateClientDto {
  name: string;
  email: string;
  cpf: string;
  phone: string;
}

export interface UpdateClientDto {
  name?: string;
  email?: string;
  cpf?: string;
  phone?: string;
}

export interface ClientResponseDto {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  accessCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedClientsDto {
  data: ClientResponseDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
