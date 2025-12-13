import { BaseEntity } from '@teddy-monorepo/api/core';

export class User extends BaseEntity {
  public readonly name: string;
  public readonly email: string;
  public readonly password: string;
  public readonly isActive: boolean;

  constructor(
    name: string,
    email: string,
    password: string,
    isActive = true,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null
  ) {
    super(id, createdAt, updatedAt, deletedAt);
    this.name = name;
    this.email = email;
    this.password = password;
    this.isActive = isActive;
  }
}
