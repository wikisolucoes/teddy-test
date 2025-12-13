# 🚀 Guia Rápido - Rodando o Backend Teddy

## Pré-requisitos

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose

## 1️⃣ Instalação

```bash
# Na raiz do monorepo
pnpm install
```

## 2️⃣ Configurar Variáveis de Ambiente

```bash
cd apps/api
cp .env.example .env

# Edite .env se necessário (valores padrão já funcionam)
```

## 3️⃣ Iniciar Serviços (Docker)

```bash
# Na pasta apps/api/
docker-compose up -d

# Logs
docker-compose logs -f api
```

Isso iniciará:
- ✅ **PostgreSQL** na porta 5432
- ✅ **Redis** na porta 6379 (opcional)
- ✅ **API** na porta 3000

## 4️⃣ Executar Migrations

```bash
# Volta para raiz do monorepo
cd ../..

# Roda migrations
pnpm nx run api:typeorm migration:run
```

## 5️⃣ Acessar Aplicação

| Serviço | URL |
|---------|-----|
| **API** | http://localhost:3000/api |
| **Swagger Docs** | http://localhost:3000/docs |
| **Health Check** | http://localhost:3000/api/health |
| **Métricas** | http://localhost:3000/api/metrics |

## 6️⃣ Testar Endpoints

### Login (obter token JWT)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

Resposta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "Admin",
    "email": "admin@example.com"
  }
}
```

### Criar Cliente

```bash
TOKEN="seu-token-jwt-aqui"

curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "João Silva",
    "cpf": "12345678909",
    "phone": "11987654321",
    "email": "joao@email.com"
  }'
```

### Listar Clientes

```bash
curl -X GET "http://localhost:3000/api/clients?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### Buscar Cliente (incrementa contador de acessos)

```bash
curl -X GET "http://localhost:3000/api/clients/{uuid}" \
  -H "Authorization: Bearer $TOKEN"
```

### Atualizar Cliente

```bash
curl -X PUT "http://localhost:3000/api/clients/{uuid}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "João da Silva Santos"
  }'
```

### Deletar Cliente (soft delete)

```bash
curl -X DELETE "http://localhost:3000/api/clients/{uuid}" \
  -H "Authorization: Bearer $TOKEN"
```

## 7️⃣ Desenvolvimento (sem Docker)

Se preferir rodar sem Docker:

```bash
# Terminal 1 - PostgreSQL local
docker run --name api-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=app_db \
  -p 5432:5432 \
  -d postgres:16-alpine

# Terminal 2 - API
pnpm nx serve api
```

## 8️⃣ Testes

```bash
# Todos os testes da API
pnpm nx test api

# Com cobertura
pnpm nx test api --coverage

# Testes de feature específica
pnpm nx test feature-clients
```

## 9️⃣ Linting

```bash
# Lint API
pnpm nx lint api

# Lint todas as libs
pnpm nx run-many -t lint --projects=tag:backend
```

## 🔟 Comandos Úteis

```bash
# Parar serviços
docker-compose down

# Parar e remover volumes (limpar DB)
docker-compose down -v

# Rebuild da imagem
docker-compose build --no-cache

# Ver logs
docker-compose logs -f

# Executar comando no container
docker-compose exec api sh
```

## 🐛 Troubleshooting

### Porta 3000 já em uso

```bash
# Matar processo
lsof -ti:3000 | xargs kill -9

# Ou mudar porta em .env
PORT=3001
```

### Migrations não aplicadas

```bash
# Verificar status
pnpm nx run api:typeorm migration:show

# Reverter migration
pnpm nx run api:typeorm migration:revert
```

### PostgreSQL não conecta

```bash
# Verificar se está rodando
docker-compose ps

# Restart
docker-compose restart postgres

# Ver logs
docker-compose logs postgres
```

## 📚 Próximos Passos

1. ✅ Implementar testes unitários
2. ✅ Implementar feature-dashboard
3. ✅ Implementar feature-health
4. ✅ Configurar Redis para cache
5. ✅ Configurar rate limiting
6. ✅ Deploy em produção

---

**Happy Coding! 🚀**
