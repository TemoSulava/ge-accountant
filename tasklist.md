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

## In Progress
- [ ] Backend domain modules: categories, invoices, expenses, bank import, tax, reminders, reports.
- [ ] Frontend architecture: layout shell, auth/entity-aware routing, TanStack Query + i18n providers.

## Planned
- [ ] Extend entity onboarding/settings UI flows on frontend.
- [ ] Develop invoices module (CRUD, PDF generation, email delivery, payments linkage).
- [ ] Implement expenses module (uploads, OCR stub, categorization, storage).
- [ ] Implement bank import parsers, mapping UI, and categorization rules engine.
- [ ] Implement tax engine with period closing, threshold tracking, RS.ge export.
- [ ] Build reminders system (BullMQ schedules, email/Telegram notifications).
- [ ] Deliver dashboards, reports (P&L, cashflow), and exports in frontend.
- [ ] Provide sample data, seed scripts, example files, and demo user.
- [ ] Add E2E smoke tests (Playwright) and ensure CI coverage.
- [ ] Finalize observability, security hardening, and documentation (OpenAPI, Postman collection, README walkthrough).