FROM nginx:alpine

# Copiar a build já pronta
COPY apps/web/dist /usr/share/nginx/html

# Criar configuração do nginx para SPA (React Router)
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Servir arquivos estáticos com cache \
    location /assets { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    \
    # Fallback para index.html para SPA routing \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
