#!/usr/bin/env bash
# Setup do MVP Mídia Kit SaaS (Linux / macOS)
set -euo pipefail

echo "==> 1/4 Instalando dependências do backend..."
cd backend
npm install
[ -f .env ] || cp ../.env .env

echo "==> 2/4 Gerando Prisma Client e aplicando migration..."
npx prisma generate
npx prisma migrate dev --name init

echo "==> 3/4 Seed (usuário demo joao@exemplo.com / 123456)..."
npm run seed
cd ..

echo "==> 4/4 Subindo com Docker..."
docker compose up --build
