# Solo Accounting SaaS (Georgia)

Monorepo for the solopreneur-focused accounting platform. The repository houses the NestJS API, React web client, shared UI/config packages, and Docker infrastructure needed to run the full stack locally.

## Repository layout
- `apps/api` - NestJS backend with Prisma ORM, Bull queues, and Swagger docs.
- `apps/web` - React (Vite) frontend with TanStack Query, Tailwind, and i18n support.
- `packages/config` - Shared ESLint/TypeScript/prettier configurations.
- `packages/ui` - Shared React component library.
- `infra/docker` - Dockerfiles, compose stack, and nginx reverse proxy config.
- `docs` - Coding guidelines and implementation status notes.

## Prerequisites
- Node.js 20.x (use `nvm install 20` or download from [nodejs.org](https://nodejs.org/)).
- npm 10.x (bundled with Node 20).
- Docker Desktop / Docker Engine + Compose v2 (recommended for infrastructure services).
- If you run services without Docker, install PostgreSQL 16, Redis 7, MinIO, and Mailhog locally and mirror the ports from the compose file.

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   - Copy the example file to create your local overrides:
     ```bash
     cp .env.example .env
     ```
   - `.env.example` is ready for the Docker Compose stack (services resolve via `db`, `redis`, `minio`, `mailhog`).
   - If you run the API directly on your host, adjust the following values in `.env` to point to localhost services:
     ```ini
     DATABASE_URL=postgres://postgres:postgres@localhost:5432/solo
     REDIS_URL=localhost
     REDIS_PORT=6379
     S3_ENDPOINT=http://localhost:9000
     MAIL_HOST=localhost
     MAIL_PORT=1025
     ```
   - Prisma reads `DATABASE_URL`; update it if you point at a different database.

## Running the stack
### Option A - Everything via Docker Compose
```bash
npm install
docker compose -f infra/docker/docker-compose.yml up -d --build
```
This launches PostgreSQL, Redis, MinIO, Mailhog, the API, the web client, and nginx on `http://localhost:8080` (proxying web + API). Stop everything with `docker compose -f infra/docker/docker-compose.yml down`.

### Option B - Node processes + Docker for dependencies
1. Start backing services (Postgres/Redis/MinIO/Mailhog):
   ```bash
   docker compose -f infra/docker/docker-compose.yml up -d db redis minio mailhog
   ```
2. Apply the Prisma schema once the database is up:
   ```bash
   npm exec --workspace api prisma db push
   ```
3. Run the API (port 3000) and web client (port 5173) in separate terminals:
   ```bash
   npm run dev:api
   ```
   ```bash
   npm run dev:web
   ```
4. Open `http://localhost:5173` for the web app. The Vite dev server proxies API calls to `http://localhost:3000/api/v1`.

## Useful scripts
- `npm run dev:api` - Start the NestJS API with hot reload.
- `npm run dev:web` - Start the Vite dev server.
- `npm run lint` - Run ESLint across all workspaces.
- `npm run test` - Execute unit tests (Vitest/Jest).
- `npm run format` - Apply prettier formatting.
- `make up` / `make down` - Convenience wrappers around the Docker Compose stack.

## Tooling & docs
- REST endpoints expose Swagger at `http://localhost:3000/api/v1/docs` (after the API boots).
- Mailhog UI: `http://localhost:8025` (email previews).
- MinIO console: `http://localhost:9001` (`minio` / `minio123`).
- Coding standards live in `docs/coding-guidelines.md`.
- Progress notes are in `docs/implementation-status.md`.

## Troubleshooting
- Ensure ports 3000, 5173, 5432, 6379, 9000, 9001, 1025, and 8025 are free before starting services.
- If Prisma cannot connect, double-check `DATABASE_URL` and that PostgreSQL is up (`docker compose ps`).
- Run `npm exec --workspace api prisma generate` after modifying the Prisma schema.
- To reset the Docker stack, remove volumes with `docker compose -f infra/docker/docker-compose.yml down -v` (this drops the database and MinIO data).
