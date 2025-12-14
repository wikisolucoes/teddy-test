import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import type { Logger } from 'winston';
import { randomUUID } from 'crypto';

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  constructor(
    @Inject('winston')
    private readonly logger: Logger
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const requestId = randomUUID();
    
    request.requestId = requestId;
    
    const startTime = Date.now();
    
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.info('Request completed', {
          requestId,
          method: request.method,
          url: request.url,
          duration: `${duration}ms`,
        });
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;

        this.logger.error('Request failed', {
          requestId,
          method: request.method,
          url: request.url,
          duration: `${duration}ms`,
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
            statusCode: error instanceof HttpException ? error.getStatus() : 500,
          },
        });
        
        return throwError(() => error);
      })
    );
  }
}
