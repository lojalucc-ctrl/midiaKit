.PHONY: setup install migrate seed up down logs

install:
	cd backend && npm install
	cd frontend && npm install

migrate:
	cd backend && npx prisma generate && npx prisma migrate dev --name init

seed:
	cd backend && npm run seed

up:
	docker compose up --build

down:
	docker compose down

logs:
	docker compose logs -f

# Tudo de uma vez: instala, migra, seed e sobe.
setup: install migrate seed up
