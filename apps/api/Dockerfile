# ===================================
# Multi-stage Dockerfile - Teddy API
# ===================================

# Stage 1: Base
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Stage 2: Dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY libs/api/*/package.json ./libs/api/
RUN pnpm install --frozen-lockfile

# Stage 3: Build
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build only the API project
RUN pnpm nx build api --prod

# Stage 4: Production
FROM node:20-alpine AS production
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy only production dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist/apps/api ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/apps/api/.env.example ./.env

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /app

USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start application
CMD ["node", "dist/main.js"]
