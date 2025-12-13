import { BaseEntity } from '@teddy-monorepo/api/core';

export class Client extends BaseEntity {
  public readonly name: string;
  public readonly email: string;
  public readonly cpf: string;
  public readonly phone: string;
  public readonly accessCount: number;

  constructor(
    name: string,
    email: string,
    cpf: string,
    phone: string,
    accessCount = 0,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null
  ) {
    super(id, createdAt, updatedAt, deletedAt);
    this.name = name;
    this.email = email;
    this.cpf = cpf;
    this.phone = phone;
    this.accessCount = accessCount;
  }
}
