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
- [x] Implement tax engine (period close/list, mark paid, reminders, RS.ge export).
- [x] Implement reminders module (cron scheduling, queue processing, notification stub).
- [x] Implement reports module (P&L and cashflow endpoints with date filtering).
- [x] Implement audit logging (global audit service, endpoints, integration across core flows).

## In Progress
- [ ] Backend domain polish: queue monitoring, analytics exports, audit dashboards.
- [ ] Frontend architecture: layout shell, auth/entity-aware routing, TanStack Query + i18n providers.

## Planned
- [ ] Extend entity onboarding/settings UI flows on frontend.
- [ ] Build background job dashboards/monitoring and notification integrations (email/Telegram).
- [ ] Develop financial reports (frontend visualisations, CSV exports) and audit-log UI.
- [ ] Provide sample data, seed scripts, example files, and demo user.
- [ ] Add E2E smoke tests (Playwright) and ensure CI coverage.
- [ ] Finalize observability, security hardening, and documentation (OpenAPI, Postman collection, README walkthrough).

## Frontend Implementation Breakdown
1. [x] Establish React app shell: global layout, navigation, theming, typography, and unique visual identity (Tailwind + custom design tokens).
2. [x] Implement auth/onboarding flow: sign-in/register screens, entity creation wizard, locale switcher, session handling.
3. [x] Build dashboard: KPI tiles, threshold bar, recent activity lists, and responsive layout.
4. [x] Deliver invoices UI: list, create/edit forms with React Hook Form + Zod, item editor, PDF trigger, email send, payments timeline.
5. Ship expenses experience: receipt upload dropzone with preview/OCR stub, categorisation controls, editable table.
6. [x] Craft bank import wizard: CSV upload, mapping UI, rule suggestions, transaction review table with bulk actions.
7. [x] Implement tax period screens: close period modal, summary, RS.ge export download, reminder scheduling UI.
8. [x] Create reminders management: list, create modal, status indicators, queue status hints.
9. [x] Build reports views: P&L and cashflow charts/tables with filters and export controls.
10. [x] Surface audit trail: filterable log viewer with action badges and context detail panel.
11. [x] Integrate notification and user settings panels (email/Telegram hooks, timezone, thresholds).
12. Add sample data seeding UI cues and link to documentation; final polish and accessibility review.
