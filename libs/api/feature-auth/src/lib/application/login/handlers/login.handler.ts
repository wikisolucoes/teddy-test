import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import type { Logger } from 'winston';
import { LoginCommand } from '../commands/login.command.js';
import type { AuthResponseDto } from '../../shared/dtos/auth-response.dto.js';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface.js';
import { Email } from '../../../domain/value-objects/email.vo.js';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand, AuthResponseDto> {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('LOGGER')
    private readonly logger: Logger
  ) {}

  async execute(command: LoginCommand): Promise<AuthResponseDto> {
    const { email, password } = command;

    const emailVO = new Email(email);

    const user = await this.userRepository.findByEmail(emailVO.getValue());

    if (!user || !user.isActive) {
      this.logger.warn('Login attempt failed', { email: emailVO.getValue() });
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      this.logger.warn('Login attempt failed - wrong password', { 
        email: emailVO.getValue() 
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '24h');

    this.logger.info('User logged in successfully', {
      userId: user.id,
      email: user.email,
    });

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: expiresIn,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
