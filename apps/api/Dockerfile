# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .pnpmfile.cjs ./
COPY nx.json tsconfig.base.json tsconfig.json ./

# Copy source code
COPY apps/api ./apps/api
COPY libs/api ./libs/api

# Install dependencies
RUN pnpm install --frozen-lockfile

# Sync Nx workspace
RUN pnpm nx sync

# Build the application
RUN pnpm nx build @teddy-monorepo/api --configuration=production

# Production stage
FROM node:20-alpine

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

WORKDIR /app

RUN addgroup --system api && \
    adduser --system -G api api

# Copy built application and dependencies
COPY --from=builder /app/apps/api/dist ./
COPY --from=builder /app/node_modules ./node_modules
COPY apps/api/docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x ./docker-entrypoint.sh && \
    chown -R api:api .

USER api

EXPOSE 3000

CMD ["./docker-entrypoint.sh"]
