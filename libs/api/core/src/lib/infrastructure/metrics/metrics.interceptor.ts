import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrometheusService } from './prometheus.service.js';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly prometheusService: PrometheusService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const duration = (Date.now() - startTime) / 1000; // Convert to seconds
          
          this.prometheusService.recordHttpRequest(
            request.method,
            this.sanitizeRoute(request.route?.path || request.url),
            response.statusCode,
            duration
          );
        },
        error: (error) => {
          const duration = (Date.now() - startTime) / 1000;
          
          this.prometheusService.recordHttpRequest(
            request.method,
            this.sanitizeRoute(request.route?.path || request.url),
            error.status || 500,
            duration
          );
        },
      })
    );
  }

  private sanitizeRoute(route: string): string {
    // Remove IDs and sensitive data from route for better grouping
    return route
      .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id')
      .replace(/\/\d+/g, '/:id');
  }
}
