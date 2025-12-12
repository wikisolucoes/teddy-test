import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';
import { NotFoundException, Inject } from '@nestjs/common';
import { ValidateTokenQuery } from '../queries/validate-token.query.js';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface.js';

interface ValidateTokenResult {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
}

@QueryHandler(ValidateTokenQuery)
export class ValidateTokenHandler 
  implements IQueryHandler<ValidateTokenQuery, ValidateTokenResult> {
  
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  async execute(query: ValidateTokenQuery): Promise<ValidateTokenResult> {
    const user = await this.userRepository.findById(query.userId);

    if (!user || !user.isActive) {
      throw new NotFoundException('User not found or inactive');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
    };
  }
}
