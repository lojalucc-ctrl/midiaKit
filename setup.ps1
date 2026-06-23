# Setup do MVP Mídia Kit SaaS (Windows / PowerShell)
# Uso: abra o PowerShell na pasta do projeto e rode:  ./setup.ps1
$ErrorActionPreference = "Stop"

Write-Host "==> 1/4 Instalando dependências do backend..." -ForegroundColor Cyan
Push-Location backend
npm install
if (-not (Test-Path ".env")) { Copy-Item "..\.env" ".env" }

Write-Host "==> 2/4 Gerando Prisma Client e aplicando migration..." -ForegroundColor Cyan
npx prisma generate
npx prisma migrate dev --name init

Write-Host "==> 3/4 Seed (usuário demo joao@exemplo.com / 123456)..." -ForegroundColor Cyan
npm run seed
Pop-Location

Write-Host "==> 4/4 Subindo com Docker..." -ForegroundColor Cyan
docker compose up --build
