# Implementation Status

This document tracks implemented, in-progress, and planned work against the Solopreneur Accounting spec.

## Completed
- npm workspace toolchain configured; repository scripts, Dockerfiles, CI, and docs updated accordingly.
- Initial monorepo skeleton for web (React/Vite) and api (NestJS) apps with shared config + UI package.
- Resolved workspace dependency compatibility for npm (removed unsupported `workspace:*` specifiers) and dropped redundant `@types/pino` dependency.
- Prisma schema restructured (moved to `apps/api/prisma`, added refresh token hash + fixed relation mappings) with PrismaModule/Service wiring in Nest.
- Authentication module implemented (register/login/refresh/logout) using bcrypt, JWT access tokens, httpOnly refresh cookies, and hashed refresh token storage.
- Entities API implemented (list/create/get/update) with DTO validation, Prisma integration, and access-token guard enforcement.
- Categories API implemented (per-entity list/create/update) with ownership guards and DTO validation.
- Invoices API implemented (per-entity list/create/get/update status, payments) with sequential numbering, totals calculation, and payment-driven status updates.
- Expenses API implemented (per-entity list/create with file upload stub, OCR placeholder, and category linkage).
- Bank import module implemented (CSV parsing for BOG/TBC/custom mappings, rules-based categorisation, transaction CRUD).

## In Progress
- Backend domain modules build-out: tax, reminders, reports.
- Frontend layout/infrastructure planning (routing shell, state/i18n providers, auth + accounting flows integration).

## Planned
- Complete backend feature set per spec (tax engine, reminders, reports) with validation, security, and automated tests.
- Deliver frontend UI/UX flows covering onboarding, dashboard, invoices, expenses, bank import, tax close, reports, and reminders.
- Seed data, sample files, and DevOps automation (Docker Compose runtime, GitHub Actions, Makefile commands) refined for production-readiness.
- Observability, notifications, localization, and compliance artifacts (OpenAPI, Postman collection, PDFs, CSV samples).