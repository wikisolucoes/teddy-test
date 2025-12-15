# Teddy Open Finance - Client Management System

Sistema full-stack de gerenciamento de clientes construído com NestJS e React, organizado em monorepo Nx.

## Visão Geral

MVP completo de gerenciamento de clientes incluindo autenticação JWT, CRUD com soft delete, dashboard administrativo com estatísticas e gráficos, contador de acessos e logs estruturados. O projeto segue princípios de Clean Architecture, DDD e CQRS.

## Arquitetura

### Ambiente Local

```
Browser (localhost:5173)
    ↓
Frontend (React + Vite)
    ↓ HTTP/REST
Backend (NestJS:3000)
    ├── API Layer (/auth, /clients, /dashboard, /health)
    ├── Application (CQRS: Commands + Queries)
    └── Domain (Entities, Services, Repositories)
    ↓
PostgreSQL (localhost:5432)
```

### Estrutura do Monorepo

```
teddy-monorepo/
├── apps/
│   ├── api/                # NestJS Backend
│   └── web/                # React Frontend
├── libs/
│   ├── api/
│   │   ├── core/
│   │   ├── feature-auth/
│   │   ├── feature-clients/
│   │   ├── feature-dashboard/
│   │   └── feature-health/
│   └── web/
│       ├── core/
│       ├── shared/
│       ├── feature-auth/
│       ├── feature-clients/
│       └── feature-dashboard/
└── .github/workflows/      # CI/CD
```

## Stack Tecnológico

**Backend:** NestJS, TypeScript, TypeORM, PostgreSQL, JWT, Swagger, Winston  
**Frontend:** React 19, Vite, TypeScript, TailwindCSS, shadcn/ui, React Hook Form, Zod, Recharts  
**DevOps:** Nx, Docker, GitHub Actions, ESLint, Prettier

## Como Executar

Requisitos: Node.js 20+, pnpm 9+, Docker

```bash
# Instalar dependências
pnpm install

# Iniciar backend (API + PostgreSQL)
cd apps/api && docker-compose up -d

# Iniciar frontend
pnpm nx serve @teddy-monorepo/web
```

**URLs:**
- Frontend: http://localhost:5173
- API: http://localhost:3000
- Swagger: http://localhost:3000/docs
- Health: http://localhost:3000/api/health
- Metrics: http://localhost:3000/api/metrics

**Credenciais padrão:** admin@teddy.com / admin123

## Estrutura do Projeto

Clean Architecture com DDD:

```
libs/api/feature-clients/
├── domain/          # Entidades e lógica de negócio
├── application/     # Casos de uso (commands/queries CQRS)
├── infrastructure/  # Implementações (repositories, database)
└── presentation/    # Controllers HTTP
```

## Decisões Arquiteturais

### CQRS

Separação entre operações de leitura e escrita para otimizar performance e escalabilidade. Queries são otimizadas para consumo de UI enquanto Commands focam em validação e mudança de estado. Facilita uso de read replicas no futuro e possibilita event sourcing.

### Monorepo Nx

Compartilhamento de código entre frontend e backend, pipelines CI/CD otimizados (affected builds), padrões consistentes e mudanças atômicas cross-stack.

### Feature Modules

Cada feature é auto-contida com domain, application, infrastructure e presentation próprios. Facilita trabalho em paralelo, adição/remoção de features e migração para microserviços se necessário.

## Proposta de Arquitetura AWS

### Diagrama de Infraestrutura

```
Internet
  ↓
Route 53 (DNS)
  ↓
CloudFront (CDN global, edge caching, DDoS protection)
  ↓
┌─────────────┬──────────────┐
S3 (Frontend) ALB (SSL/TLS)
              ↓
          VPC (10.0.0.0/16)
          ├── Public Subnets (NAT Gateway, ALB)
          └── Private Subnets
              ├── ECS Fargate (API tasks, auto-scale 2-10)
              ├── RDS PostgreSQL (Multi-AZ, read replicas)
              └── ElastiCache Redis (sessions, cache)

Observability: CloudWatch + X-Ray + Secrets Manager
Security: WAF + Shield
```

### Componentes

**Frontend (S3 + CloudFront):**  
React build estático servido via S3 com CloudFront como CDN global. HTTPS via ACM, caching em edge locations para baixa latência.

**API (ALB + ECS Fargate):**  
Application Load Balancer com SSL termination e health checks. ECS Fargate para orquestração serverless de containers com auto-scaling (2-10 tasks) baseado em CPU/memória. Blue-green deployments via GitHub Actions → ECR → ECS.

**Database (RDS PostgreSQL):**  
Multi-AZ deployment com failover automático. Read replicas para otimização de queries. Backups automatizados e point-in-time recovery.

**Cache (ElastiCache Redis):**  
Sessões, cache de queries, rate limiting. Cluster mode para sharding em alta escala.

**Segurança:**
- VPC com subnets públicas (ALB, NAT) e privadas (ECS, RDS)
- Security groups restritivos por camada
- Secrets Manager para credenciais
- WAF para proteção contra SQL injection, XSS e rate limiting

**Observabilidade:**
- CloudWatch: métricas (request count, latency p50/p95/p99, error rate), logs estruturados JSON, alarms
- X-Ray: distributed tracing para identificar bottlenecks
- Prometheus metrics endpoint (/api/metrics)

### Escalabilidade

**Horizontal:** ECS auto-scaling, read replicas RDS, ElastiCache sharding  
**Vertical:** Upgrade de instância RDS durante off-peak, ajuste de CPU/memória ECS  
**Cache:** Dashboard stats (5min TTL), client lists (1min TTL), sessões Redis

**Triggers:**
- Scale up: CPU > 70% ou latency > 1s
- Scale down: CPU < 30% por 10min

**Custo estimado:** ~$130/mês (1k users/dia) a ~$500/mês (10k users/dia)

## Observabilidade

Logs estruturados em JSON (Winston), health check em `/api/health`, métricas Prometheus em `/api/metrics`. Implementado para debugging rápido, monitoramento proativo, otimização de performance e compliance com auditoria.

## CI/CD

GitHub Actions com pipelines separados para API e Web. Nx affected builds (compila apenas projetos alterados), testes em paralelo, build Docker, lint e format check. Artefatos salvos para debugging.

## Testes

```bash
pnpm nx run-many -t test --all          # Todos os testes
pnpm nx test @teddy-monorepo/api        # Backend
pnpm nx test @teddy-monorepo/web        # Frontend
pnpm nx e2e @teddy-monorepo/web-e2e     # E2E (Playwright)
```

Backend: Jest (unit, integration, E2E)  
Frontend: Jest + React Testing Library (components, hooks)  
E2E: Playwright (fluxos críticos)

## Documentação

Consulte os READMEs específicos de cada aplicação:

- [Backend API](/apps/api/README.md) - Instruções para rodar e documentação dos endpoints
- [Frontend Web](/apps/web/README.md) - Instruções para rodar e estrutura do projeto
- Swagger: Disponível em `/docs` quando a API estiver rodando
