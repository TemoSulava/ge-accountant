.PHONY: up down install seed test lint

install:
	npm install

up:
	docker compose -f infra/docker/docker-compose.yml up -d

down:
	docker compose -f infra/docker/docker-compose.yml down

lint:
	npm run lint

test:
	npm run test

seed:
	npm exec --workspace api prisma db seed
