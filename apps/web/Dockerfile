# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .pnpmfile.cjs ./
COPY nx.json tsconfig.base.json ./

# Copy source code
COPY apps/web ./apps/web
COPY libs/web ./libs/web

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the application
RUN pnpm nx build @teddy-monorepo/web --configuration=production

# Production stage
FROM nginx:alpine

# Copy built app
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Copy nginx config for SPA routing
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
