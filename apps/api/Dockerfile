# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY nx.json tsconfig.base.json ./

# Copy source code
COPY apps/api ./apps/api
COPY libs/api ./libs/api

# Install dependencies
RUN pnpm install --frozen-lockfile

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
COPY --from=builder /app/dist/apps/api ./
COPY --from=builder /app/node_modules ./node_modules

RUN chown -R api:api .

USER api

EXPOSE 3000

CMD ["node", "main.js"]
