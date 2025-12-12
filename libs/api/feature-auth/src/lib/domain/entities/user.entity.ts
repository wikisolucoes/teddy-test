export class User {
  id!: string;
  name!: string;
  email!: string;
  password!: string;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  constructor(partial?: Partial<User>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
