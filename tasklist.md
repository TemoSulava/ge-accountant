# Task List

## Completed
- [x] Bootstrap initial monorepo structure (web, api, shared packages, infra).
- [x] Migrate tooling to npm workspaces (scripts, Dockerfiles, CI, documentation).
- [x] Establish implementation tracking docs (`docs/implementation-status.md`).
- [x] Remove unsupported `workspace:*` dependency notation for npm compatibility.
- [x] Align dependency versions with npm registry availability and remove redundant typings (`@types/pino`).
- [x] Reorganize Prisma schema + service layer (refresh token support, relation fixes) and run `prisma generate`.
- [x] Implement authentication (register/login/refresh/logout) with bcrypt hashing, JWT access tokens, and secure refresh cookies.
- [x] Implement entity management API (CRUD endpoints, validation, access guards).
- [x] Implement category management API (per-entity CRUD endpoints with validation and ownership checks).
- [x] Implement invoices API (per-entity CRUD, sequential numbering, payments, status updates).
- [x] Implement expenses API (per-entity list/create with file upload + OCR placeholder).
- [x] Implement bank import module (CSV parsing, rule-based categorisation, transaction management).

## In Progress
- [ ] Backend domain modules: tax engine, reminders, reports.
- [ ] Frontend architecture: layout shell, auth/entity-aware routing, TanStack Query + i18n providers.

## Planned
- [ ] Extend entity onboarding/settings UI flows on frontend.
- [ ] Implement tax engine with period closing, threshold tracking, RS.ge export.
- [ ] Build reminders system (BullMQ schedules, email/Telegram notifications).
- [ ] Deliver dashboards, reports (P&L, cashflow), and exports in frontend.
- [ ] Provide sample data, seed scripts, example files, and demo user.
- [ ] Add E2E smoke tests (Playwright) and ensure CI coverage.
- [ ] Finalize observability, security hardening, and documentation (OpenAPI, Postman collection, README walkthrough).