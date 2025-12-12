import {
  Injectable,
  type NestInterceptor,
  type ExecutionContext,
  type CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { Logger } from 'winston';
import { sanitizeForLog } from '../../infrastructure/logger/winston.config.js';
import type { Request } from 'express';

interface RequestWithUser extends Request {
  user?: { id?: string };
}

/**
 * Loga todas as requisições e respostas HTTP
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const { method, url, body, user } = request;
    const startTime = Date.now();

    this.logger.info('Incoming request', {
      method,
      url,
      body: sanitizeForLog(body),
      userId: user?.id,
    });

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          this.logger.info('Request completed', {
            method,
            url,
            duration: `${duration}ms`,
            userId: user?.id,
          });
        },
        error: (error: Error) => {
          const duration = Date.now() - startTime;
          this.logger.error('Request failed', {
            method,
            url,
            duration: `${duration}ms`,
            error: error.message,
            userId: user?.id,
          });
        },
      })
    );
  }
}
