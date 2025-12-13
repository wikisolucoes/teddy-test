FROM node:20-alpine

ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

RUN addgroup --system api && \
    adduser --system -G api api

# Copiar apenas o dist já buildado e package.json
COPY apps/api/dist ./
COPY node_modules ./node_modules
RUN chown -R api:api .

USER api

EXPOSE 3000

CMD ["node", "main.js"]
