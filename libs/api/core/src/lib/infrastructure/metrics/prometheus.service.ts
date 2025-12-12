import { Injectable } from '@nestjs/common';
import { Registry, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';

@Injectable()
export class PrometheusService {
  public readonly registry: Registry;
  
  public readonly httpRequestsTotal: Counter;
  public readonly httpRequestDuration: Histogram;
  
  public readonly dbQueriesTotal: Counter;
  public readonly dbQueryDuration: Histogram;
  public readonly dbConnectionsActive: Gauge;
  
  public readonly clientsTotal: Gauge;
  public readonly authAttemptsTotal: Counter;

  constructor() {
    this.registry = new Registry();
    
    collectDefaultMetrics({
      register: this.registry,
      prefix: 'teddy_api_',
    });
    
    this.httpRequestsTotal = new Counter({
      name: 'teddy_api_http_requests_total',
      help: 'Total de requisições HTTP',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.registry],
    });
    
    this.httpRequestDuration = new Histogram({
      name: 'teddy_api_http_request_duration_seconds',
      help: 'Duração das requisições HTTP em segundos',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
      registers: [this.registry],
    });
    
    this.dbQueriesTotal = new Counter({
      name: 'teddy_api_db_queries_total',
      help: 'Total de queries no banco de dados',
      labelNames: ['operation', 'entity'],
      registers: [this.registry],
    });
    
    this.dbQueryDuration = new Histogram({
      name: 'teddy_api_db_query_duration_seconds',
      help: 'Duração das queries no banco de dados',
      labelNames: ['operation', 'entity'],
      buckets: [0.001, 0.01, 0.05, 0.1, 0.5, 1],
      registers: [this.registry],
    });
    
    this.dbConnectionsActive = new Gauge({
      name: 'teddy_api_db_connections_active',
      help: 'Número de conexões ativas no banco de dados',
      labelNames: ['connection'],
      registers: [this.registry],
    });
    
    this.clientsTotal = new Gauge({
      name: 'teddy_api_clients_total',
      help: 'Total de clientes cadastrados',
      registers: [this.registry],
    });
    
    this.authAttemptsTotal = new Counter({
      name: 'teddy_api_auth_attempts_total',
      help: 'Total de tentativas de autenticação',
      labelNames: ['status'],
      registers: [this.registry],
    });
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
