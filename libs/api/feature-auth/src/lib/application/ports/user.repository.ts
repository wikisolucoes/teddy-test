import { BaseRepository } from '@teddy-monorepo/api/core';
import { User } from '../../domain/entities/user.entity.js';

export abstract class UserRepository extends BaseRepository<User> {
  abstract findByEmail(email: string): Promise<User | null>;
}
