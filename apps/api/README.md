# Teddy API - Backend

API de gerenciamento de clientes desenvolvida com NestJS, seguindo princípios de **Arquitetura Hexagonal**, **DDD** e **CQRS**.

## 🏗️ Arquitetura

- **Hexagonal Architecture (Ports & Adapters)**
- **Domain-Driven Design (DDD)**
- **CQRS (Command Query Responsibility Segregation)**
- **Monorepo Nx** com libs modulares

## 📚 Stack Tecnológica

- **NestJS** v11
- **TypeScript** (strict mode)
- **TypeORM** v0.3
- **PostgreSQL** 16
- **JWT** para autenticação
- **Zod** para validação
- **Winston** para logging
- **Swagger** para documentação
- **Docker** & **Docker Compose**

## 🚀 Como Rodar

### Pré-requisitos

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose

### 1. Instalar Dependências

```bash
pnpm install
```

### 2. Configurar Variáveis de Ambiente

```bash
# Na raiz do projeto apps/api/
cp .env.example .env

# Edite o arquivo .env conforme necessário
```

### 3. Rodar com Docker Compose (Recomendado)

```bash
cd apps/api
docker-compose up -d
```

Isso irá iniciar:
- PostgreSQL na porta 5432
- Redis na porta 6379
- API na porta 3000

### 4. Executar Migrations

```bash
# Com Docker rodando
pnpm nx run api:typeorm migration:run

# Ou localmente
pnpm typeorm migration:run -d libs/api/core/src/lib/infrastructure/database/typeorm.config.ts
```

### 5. Acessar a Aplicação

- **API**: http://localhost:3000/api
- **Swagger Docs**: http://localhost:3000/docs
- **Health Check**: http://localhost:3000/api/health
- **Metrics**: http://localhost:3000/api/metrics

## 🧪 Testes

```bash
# Rodar todos os testes
pnpm nx test api

# Testes com cobertura
pnpm nx test api --coverage

# Testes de uma lib específica
pnpm nx test feature-clients
```

## 📋 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `NODE_ENV` | Ambiente de execução | `development` |
| `PORT` | Porta da aplicação | `3000` |
| `DB_WRITE_HOST` | Host do banco (escrita) | `localhost` |
| `DB_WRITE_PORT` | Porta do banco (escrita) | `5432` |
| `DB_WRITE_USERNAME` | Usuário do banco | `postgres` |
| `DB_WRITE_PASSWORD` | Senha do banco | `postgres` |
| `DB_WRITE_DATABASE` | Nome do banco | `app_db` |
| `DB_READ_*` | Mesmas configs para conexão de leitura | - |
| `JWT_SECRET` | Secret para JWT | **CHANGE IN PROD** |
| `JWT_EXPIRES_IN` | Tempo de expiração do token | `24h` |

## 📁 Estrutura de Libs

```
libs/api/
├── core/                    # Infraestrutura compartilhada
│   ├── domain/             # BaseEntity, interfaces
│   ├── application/        # BaseRepository
│   ├── infrastructure/     # Database, Logger, Metrics
│   └── common/             # Pipes, Filters, Decorators
│
├── feature-auth/           # Autenticação
│   ├── domain/
│   ├── application/        # CQRS (Login, Validate)
│   ├── infrastructure/     # JWT, UserRepository
│   └── presentation/       # AuthController
│
└── feature-clients/        # Gerenciamento de Clientes
    ├── domain/             # Client entity, VOs
    ├── application/        # CQRS (CRUD completo)
    ├── infrastructure/     # ClientRepository
    └── presentation/       # ClientsController
```

## 🔐 Autenticação

Todos os endpoints (exceto `/auth/login`) requerem autenticação JWT via header `Authorization: Bearer <token>`.

### Login

```bash
POST /api/auth/login
{
  "email": "admin@teddy.com",
  "password": "admin123"
}
```

## 📊 Endpoints Principais

### Auth
- `POST /api/auth/login` - Login e geração de token
- `GET /api/auth/me` - Dados do usuário autenticado

### Clients
- `POST /api/clients` - Criar cliente
- `GET /api/clients` - Listar clientes (com paginação)
- `GET /api/clients/:id` - Buscar cliente (incrementa contador)
- `PUT /api/clients/:id` - Atualizar cliente
- `DELETE /api/clients/:id` - Deletar cliente (soft delete)

Veja documentação completa em `/docs` (Swagger).

## 🏥 Observabilidade

### Health Check

```bash
GET /api/health
```

Retorna status de:
- Database (write connection)
- Database (read connection)
- Redis (se configurado)

### Métricas (Prometheus)

```bash
GET /api/metrics
```

Métricas disponíveis:
- `http_requests_total` - Total de requests HTTP
- `http_request_duration_seconds` - Duração das requests
- `db_query_duration_seconds` - Duração das queries
- `clients_total` - Total de clientes

## 🐳 Docker

### Build da Imagem

```bash
docker build -t teddy-api -f apps/api/Dockerfile .
```

### Rodar Container

```bash
docker run -p 3000:3000 --env-file apps/api/.env teddy-api
```

## 🔄 CI/CD

Pipeline configurado no GitHub Actions (`.github/workflows/api-ci.yml`):

- ✅ Lint (ESLint)
- ✅ Tests (Jest com cobertura)
- ✅ Build (Nx)
- ✅ Docker Build & Push

## 📝 Convenções

- **Commits**: Semantic Commits (`feat:`, `fix:`, `docs:`, etc)
- **Branches**: `feature/`, `bugfix/`, `hotfix/`
- **Code Style**: ESLint + Prettier
- **TypeScript**: Strict mode habilitado
