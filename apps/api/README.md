# API - Backend

API de gerenciamento de clientes desenvolvida com NestJS, seguindo Clean Architecture, DDD e CQRS.

## Stack

NestJS, TypeScript, TypeORM, PostgreSQL, JWT, Swagger, Winston, Docker

## Como Executar

### Com Docker (Recomendado)

```bash
cd apps/api
docker-compose up -d
```

Isso iniciará:

- API na porta 3000
- PostgreSQL na porta 5432
- Banco de dados será inicializado automaticamente

### Sem Docker

```bash
# Iniciar PostgreSQL manualmente
docker run -d \
  --name teddy-postgres \
  -e POSTGRES_DB=teddy \
  -e POSTGRES_USER=teddy \
  -e POSTGRES_PASSWORD=teddy123 \
  -p 5432:5432 \
  postgres:16-alpine

# Configurar variáveis (se necessário)
cp .env.example .env

# Rodar API
pnpm nx serve @teddy-monorepo/api
```

## URLs

- API: <http://localhost:3000>
- Swagger: <http://localhost:3000/docs>
- Health: <http://localhost:3000/api/health>
- Metrics: <http://localhost:3000/api/metrics>

## Estrutura

```
apps/api/
├── src/
│   ├── app/
│   │   ├── app.module.ts       # Módulo principal
│   │   └── app.controller.ts   # Controller raiz
│   └── main.ts                 # Entry point
├── libs/                       # Features modulares
│   ├── core/                   # Shared utilities
│   ├── feature-auth/           # Autenticação
│   ├── feature-clients/        # CRUD de clientes
│   ├── feature-dashboard/      # Dashboard/estatísticas
│   └── feature-health/         # Health checks
├── Dockerfile
├── docker-compose.yml
└── init-db.sql
```

Cada feature segue Clean Architecture:

- `domain/`: Entidades e lógica de negócio
- `application/`: Casos de uso (commands/queries)
- `infrastructure/`: Implementações (repositories, database)
- `presentation/`: Controllers HTTP

## Testes

```bash
pnpm nx test @teddy-monorepo/api          # Unit tests
pnpm nx test @teddy-monorepo/api --watch  # Watch mode
pnpm nx run @teddy-monorepo/api:test:cov  # Coverage
```

## Build

```bash
pnpm nx build @teddy-monorepo/api
```

Build output: `dist/apps/api/`

## Endpoints Principais

- `POST /api/auth/login` - Login
- `GET /api/clients` - Listar clientes
- `POST /api/clients` - Criar cliente
- `GET /api/clients/:id` - Buscar cliente
- `PUT /api/clients/:id` - Atualizar cliente
- `DELETE /api/clients/:id` - Deletar cliente (soft delete)
- `GET /api/dashboard/stats` - Estatísticas
- `GET /api/health` - Health check
- `GET /api/metrics` - Prometheus metrics

Documentação completa disponível em `/docs` (Swagger).
