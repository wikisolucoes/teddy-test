import {
  type ExceptionFilter,
  Catch,
  type ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import type { Logger } from 'winston';

interface ErrorResponse {
  message: string;
  errors?: unknown;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: unknown = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const errorResp = exceptionResponse as ErrorResponse;
        message = errorResp.message || message;
        errors = errorResp.errors;
      } else {
        message = String(exceptionResponse);
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse: Record<string, unknown> = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
    };
    
    if (errors) {
      errorResponse.errors = errors;
    }

    this.logger.error('Exception caught', {
      error: message,
      stack: exception instanceof Error ? exception.stack : undefined,
      path: request.url,
      method: request.method,
      statusCode: status,
      user: (request as unknown as { user?: { id?: string } }).user?.id,
    });

    response.status(status).json(errorResponse);
  }
}
