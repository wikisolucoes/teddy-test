
# Build stage
FROM node:20-alpine AS builder

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .pnpmfile.cjs ./
COPY nx.json tsconfig.base.json tsconfig.json ./

# Copy source code
COPY apps/web ./apps/web
COPY libs/web ./libs/web

# Install dependencies
RUN pnpm install --frozen-lockfile

# Sync Nx workspace
RUN pnpm nx sync

# Build the application
RUN VITE_API_URL=$VITE_API_URL pnpm nx build @teddy-monorepo/web --configuration=production

# Production stage
FROM nginx:alpine

# Copy built app
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Create nginx config template that uses PORT env variable
RUN echo 'server { \
    listen $PORT; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Enable gzip compression \
    gzip on; \
    gzip_vary on; \
    gzip_min_length 1024; \
    gzip_types text/css application/javascript application/json image/svg+xml; \
    \
    # MIME types \
    types { \
        text/html html; \
        text/css css; \
        text/javascript js; \
        application/javascript js; \
        application/json json; \
        image/svg+xml svg; \
        image/png png; \
        image/jpeg jpg jpeg; \
        image/gif gif; \
        image/x-icon ico; \
        font/woff woff; \
        font/woff2 woff2; \
        font/ttf ttf; \
        font/eot eot; \
    } \
    \
    # Serve static assets with cache \
    location ~* \.(?:css|js|jpg|jpeg|gif|png|ico|svg|woff|woff2|ttf|eot)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    \
    # SPA routing - serve index.html for all routes \
    location / { \
        try_files $uri $uri/ /index.html; \
        add_header Cache-Control "no-cache"; \
    } \
}' > /etc/nginx/conf.d/default.conf.template

# Create entrypoint script to substitute PORT env variable
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'export PORT=${PORT:-80}' >> /docker-entrypoint.sh && \
    echo 'envsubst '\''$PORT'\'' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf' >> /docker-entrypoint.sh && \
    echo 'exec nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

EXPOSE 80

CMD ["/docker-entrypoint.sh"]
