# Rattel Operational Platform

**Status**: Planning approved — Phase 1 repository preparation in progress  
**Last Updated**: 21 July 2026  
**Repository**: `rattelquran476-prog/rattl-report-generator`

---

## 1. Project Overview

Rattel is a child-safe Arabic RTL Quran education platform.

This repository is being prepared for the future Rattel operational platform, which will manage:

- Families and parents.
- Students.
- Teachers.
- Teacher availability.
- Schedules and sessions.
- Session reports.
- Requests.
- Subscriptions and payment tracking.
- Admin, operations, finance, teacher, and parent workflows.

The operational platform is planned to run separately from the public marketing website.

Approved operational platform domain:

```text
https://app.ratel-quran.com
```

Existing public website:

```text
https://ratel-quran.com
```

The public website must remain untouched unless the owner explicitly approves a separate public website change.

---

## 2. Current Status

The repository is currently in the controlled documentation and preparation phase.

Completed planning documents:

- `AGENTS.md`
- `TECHNICAL_AUDIT.md`
- `ARCHITECTURE_DECISIONS.md`
- `ARCHITECTURE.md`
- `DATABASE_SCHEMA.md`
- `PERMISSIONS.md`
- `TESTING.md`
- `DEPLOYMENT.md`
- `IMPLEMENTATION_PLAN.md`

Current implementation stage:

```text
Phase 1: Repository preparation
```

Phase 1 is limited to safe repository baseline files only.

Allowed Phase 1 files:

- `README.md`
- `.gitignore`
- `.env.example`

No application code has been written yet.

---

## 3. Documentation Map

| File | Purpose |
|---|---|
| `AGENTS.md` | Codex/Copilot operating instructions and project constraints |
| `TECHNICAL_AUDIT.md` | Initial repository and website inspection |
| `ARCHITECTURE_DECISIONS.md` | Owner-approved architecture decisions |
| `ARCHITECTURE.md` | System architecture specification |
| `DATABASE_SCHEMA.md` | Logical PostgreSQL/Supabase schema plan |
| `PERMISSIONS.md` | Role-based access-control and RLS model |
| `TESTING.md` | Testing strategy and permission test scenarios |
| `DEPLOYMENT.md` | Deployment, environment, DNS, secrets, and rollback strategy |
| `IMPLEMENTATION_PLAN.md` | Phase-by-phase implementation plan |
| `README.md` | Repository overview and working rules |
| `.gitignore` | Files that must not be committed |
| `.env.example` | Placeholder-only environment variable template |

Before implementation begins, contributors must read the relevant planning documents.

---

## 4. Approved Architecture Summary

Approved technology direction:

| Area | Approved Choice |
|---|---|
| Application framework | Next.js + TypeScript |
| Hosting | Vercel |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| Authorization | Server-side checks + Supabase Row-Level Security |
| Operational domain | `app.ratel-quran.com` |
| Public website | `ratel-quran.com` remains untouched |
| Payments | Fawaterk remains external |
| Card data | Must never be stored |

Approved roles:

- Admin
- Operations
- Finance
- Teacher
- Parent

Approved security model:

- Parents see only their own children.
- Teachers see only assigned students.
- Finance sees payment and subscription data only.
- Operations manages operational workflows.
- Admin has full access with audit logging.
- All protected access must be enforced server-side.
- Supabase RLS is required for sensitive tables.
- Frontend hiding is convenience only and is not security.

---

## 5. Safety Constraints

The following constraints apply to all work in this repository.

Do not:

- Modify the public website without explicit owner approval.
- Create a Next.js project before Phase 2 approval.
- Install dependencies before approval.
- Create database tables before approval.
- Create migrations before approval.
- Configure Supabase before approval.
- Configure Vercel before approval.
- Deploy staging or production before approval.
- Store payment card data.
- Commit secrets.
- Commit `.env.local`.
- Use real child data in tests, seed data, screenshots, or documentation.
- Expose parent, student, teacher, payment, or internal notes to unauthorized roles.

All work must preserve child-data privacy and owner approval gates.

---

## 6. Implementation Phases Summary

Implementation must follow the approved sequence in `IMPLEMENTATION_PLAN.md`.

High-level phases:

1. Phase 0 — Owner approval gate.
2. Phase 1 — Repository preparation.
3. Phase 2 — Next.js project scaffold.
4. Phase 3 — Environment variable placeholders.
5. Phase 4 — Supabase staging setup.
6. Phase 5 — Database migration planning.
7. Phase 6 — Database schema implementation.
8. Phase 7 — Row-Level Security implementation.
9. Phase 8 — Authentication implementation.
10. Phase 9 — Server-side authorization.
11. Phase 10 — Role-based routing and layouts.
12. Phase 11 — Admin dashboard.
13. Phase 12 — Operations dashboard.
14. Phase 13 — Teacher dashboard.
15. Phase 14 — Parent dashboard.
16. Phase 15 — Finance dashboard.
17. Phase 16 — Public registration form.
18. Phase 17 — Request workflows.
19. Phase 18 — Session and report workflows.
20. Phase 19 — Subscription and payment tracking.
21. Phase 20 — Notifications.
22. Phase 21 — Audit logging.
23. Phase 22 — Testing.
24. Phase 23 — Staging deployment.
25. Phase 24 — Production preparation.
26. Phase 25 — Production deployment.
27. Phase 26 — Post-launch stabilization.

Each phase requires a focused issue or pull request and owner approval where required.

---

## 7. Development Rules

### General rules

- Work from the approved documentation.
- Keep changes small and reviewable.
- Do not mix unrelated changes.
- Do not skip phases.
- Do not create broad uncontrolled commits.
- Stop if requirements conflict.
- Ask for owner approval before moving to a restricted phase.

### Git rules

Recommended branch pattern:

```text
docs/readme
chore/repository-baseline
chore/scaffold-nextjs
feat/auth
feat/admin-dashboard
feat/teacher-dashboard
feat/parent-dashboard
feat/finance-dashboard
feat/public-registration
test/permissions
deploy/staging
```

Recommended commit style:

```text
Add repository README
Add gitignore defaults
Add environment placeholder template
Scaffold Next.js application
Add Supabase auth configuration
Add permission tests
```

### Pull request expectations

Every pull request should include:

- Summary.
- Files changed.
- Scope confirmation.
- Security impact.
- Data privacy impact.
- Tests or verification performed.
- Confirmation that no secrets were committed.
- Confirmation that no real child data was used.

---

## 8. Environment and Secrets Rules

Environment variables must be handled safely.

Allowed:

- `.env.example` with placeholders only.
- `.env.local` for local developer values only.

Forbidden:

- Committing `.env.local`.
- Committing production secrets.
- Committing Supabase service role keys.
- Committing Fawaterk API keys.
- Committing webhook secrets.
- Committing database passwords.
- Committing real user or child data.

Production secrets must be stored only in approved platforms such as Vercel, Supabase, or an approved secret manager.

---

## 9. Data Privacy Rules

The platform will eventually handle sensitive child and family data.

Before any real child data is used:

- RLS must be implemented.
- Server-side authorization must be implemented.
- Permission tests must pass.
- Parent isolation tests must pass.
- Teacher assignment tests must pass.
- Finance restriction tests must pass.
- Audit logging must be working.
- Owner approval must be recorded.

Fictional seed data only is allowed until then.

---

## 10. Payment Safety Rules

Fawaterk remains the external payment processor.

The platform may store:

- Payment status.
- Payment due date.
- External payment link.
- Receipt link.
- External payment reference.
- Subscription status.

The platform must never store:

- Card number.
- CVV.
- Full PAN.
- Raw card details.
- Payment processor secrets in frontend code.
- Webhook secrets in logs.

---

## 11. Owner Approval Requirements

Owner approval is required before:

- Creating the Next.js project.
- Installing dependencies.
- Creating `.env.example`.
- Configuring Supabase.
- Creating database migrations.
- Creating database tables.
- Enabling RLS policies.
- Creating authentication flows.
- Creating role dashboards.
- Creating payment tracking.
- Creating deployment configuration.
- Deploying staging.
- Deploying production.
- Importing real child data.
- Modifying the public website.

Production deployment requires explicit owner approval.

---

## 12. Phase 1 Scope

Current approved scope:

```text
Phase 1: Repository preparation
```

Allowed files:

- `README.md`
- `.gitignore`
- `.env.example`

Forbidden in Phase 1:

- Application code.
- `package.json`.
- Next.js scaffold.
- Dependencies.
- Database tables.
- Migrations.
- Supabase configuration.
- Vercel configuration.
- Deployment files.
- Real secrets.
- Real child data.
- Public website changes.

---

## 13. Stop Conditions

Stop immediately if:

- A requested change conflicts with approved documentation.
- A secret is exposed.
- Real child data appears.
- Payment card data is proposed.
- Public website changes are requested without approval.
- Production deployment is requested without approval.
- RLS or server-side authorization is skipped.
- Parent/teacher/finance data isolation is weakened.

---

## 14. Current Next Step

After this README is approved, continue Phase 1 with:

1. `.gitignore`
2. `.env.example`

Then stop and wait for owner approval before Phase 2.

---

**Status**: Phase 1 repository preparation.  
**Next Step**: Add `.gitignore` and `.env.example` with safe defaults and placeholders only.
