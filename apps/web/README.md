# Web - Frontend

Aplicação React para gerenciamento de clientes com autenticação, dashboard e CRUD completo.

## Stack

React 19, Vite, TypeScript, TailwindCSS, shadcn/ui, React Hook Form, Zod, Recharts, Axios

## Como Executar

### Desenvolvimento

```bash
# A partir da raiz do monorepo
pnpm nx serve @teddy-monorepo/web
```

Aplicação estará disponível em <http://localhost:5173>

**Importante:** A API deve estar rodando em <http://localhost:3000> (ver `/apps/api/README.md`)

### Build para Produção

```bash
pnpm nx build @teddy-monorepo/web
```

Build output: `apps/web/dist/`

### Docker

```bash
cd apps/web
docker build -t teddy-web .
docker run -p 8080:80 teddy-web
```

## Estrutura

```
apps/web/
├── src/
│   ├── app/
│   │   ├── App.tsx           # Componente principal
│   │   └── routes.tsx        # Configuração de rotas
│   ├── main.tsx              # Entry point
│   └── styles.css            # Tailwind imports
├── libs/                     # Features modulares
│   ├── core/                 # API client, interceptors
│   ├── shared/               # UI components (shadcn)
│   ├── feature-auth/         # Login, AuthContext
│   ├── feature-clients/      # CRUD de clientes
│   └── feature-dashboard/    # Dashboard com charts
├── Dockerfile
└── index.html
```

Cada feature segue estrutura DDD:

- `domain/`: Entidades
- `application/`: DTOs e Services
- `infrastructure/`: Repositories (API calls)
- `presentation/`: Components, Pages, Hooks

## Funcionalidades

- **Autenticação**: Login com JWT, proteção de rotas
- **Dashboard**: Cards com estatísticas, gráfico de clientes, lista de últimos cadastros
- **Clientes**: Listagem paginada, criar, editar, deletar, visualizar detalhes
- **Seleção**: Sistema de seleção múltipla de clientes
- **Máscaras**: CPF e telefone formatados automaticamente
- **Validação**: Formulários com Zod + React Hook Form
- **Responsivo**: Mobile-first com TailwindCSS

## Testes

```bash
pnpm nx test @teddy-monorepo/web          # Unit tests
pnpm nx test @teddy-monorepo/web --watch  # Watch mode
pnpm nx e2e @teddy-monorepo/web-e2e       # E2E (Playwright)
```

## Rotas

- `/` - Redirect para dashboard (se autenticado) ou login
- `/login` - Página de login
- `/dashboard` - Dashboard com estatísticas
- `/clients` - Lista de clientes
- `/clients-selected` - Clientes selecionados

## Variáveis de Ambiente

O frontend se comunica com a API via `http://localhost:3000` por padrão. Para alterar:

```typescript
// libs/web/core/src/lib/shared/config/env.config.ts
export const ENV_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
};
```

## Credenciais Padrão

```
Email: admin@teddy.com
Password: admin123
```
