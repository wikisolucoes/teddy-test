import { User } from '../entities/user.entity.js';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  create(user: Partial<User>): Promise<User>;
}
