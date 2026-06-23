# ---- Build stage ----
# node:20-slim (Debian Bookworm, OpenSSL 3.0) — mais estável para o Prisma que o Alpine.
FROM node:20-slim AS builder
WORKDIR /app
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Runtime stage ----
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3333

# Aplica migrations pendentes (se houver) e sobe o servidor. O '|| echo' evita
# derrubar o container caso o banco já esteja migrado / sem pasta de migrations.
CMD ["sh", "-c", "npx prisma migrate deploy || echo 'migrate deploy: nada a aplicar'; node dist/server.js"]
