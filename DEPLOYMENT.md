# DEPLOYMENT.md: Rattel Operational Platform

**Document Version**: 1.0  
**Last Updated**: 21 July 2026  
**Status**: Draft — awaiting owner approval  
**Scope**: Deployment and environment strategy documentation only. No application code, dependencies, migrations, database projects, domains, or production deployments have been created.

---

## 1. Deployment Overview

The Rattel operational platform will be deployed as a separate SaaS application for managing families, students, teachers, schedules, reports, subscriptions, payments, requests, and operational workflows.

The approved deployment direction is:

- Public marketing website remains at `https://ratel-quran.com`.
- Operational platform will run at `https://app.ratel-quran.com`.
- Application hosting will use Vercel.
- Database, Auth, and Row-Level Security will use Supabase.
- Payments remain external through Fawaterk.
- No card data will be stored in the platform.
- No production deployment may happen without explicit owner approval.

This document does not deploy anything. It defines the deployment strategy that must be approved before implementation.

---

## 2. Approved Hosting Architecture

### Approved stack

| Layer | Approved Choice | Purpose |
|---|---|---|
| Application hosting | Vercel | Host Next.js application |
| Database | Supabase PostgreSQL | Relational data storage |
| Authentication | Supabase Auth | User authentication and sessions |
| Authorization | Server-side checks + Supabase RLS | Role-based and row-level access control |
| Domain | `app.ratel-quran.com` | Operational platform |
| Public website | `ratel-quran.com` | Existing marketing website |
| Payments | Fawaterk | External payment processing |
| Email | TBD | Transactional notifications |
| Monitoring | TBD | Error tracking and uptime monitoring |

### Deployment safety goals

- Keep public website untouched.
- Deploy operational app independently.
- Prevent accidental exposure of child data.
- Prevent frontend exposure of secrets.
- Prevent real data usage before RLS and permission tests pass.
- Support rollback.
- Require owner approval before production.

---

## 3. Domain Strategy

### Public website

The existing public website remains:

```text
https://ratel-quran.com
```

It must remain untouched unless the owner explicitly approves a separate website update.

### Operational platform

The operational platform should use:

```text
https://app.ratel-quran.com
```

### Why subdomain deployment

Using `app.ratel-quran.com` is safer than `/portal` because:

- It avoids route conflicts with the public site.
- It separates operational deployment from marketing deployment.
- It protects SEO and existing public URLs.
- It allows independent rollback.
- It follows common SaaS convention.

### Future public website links

Only after owner approval, the public website may link to:

```text
https://app.ratel-quran.com/register
https://app.ratel-quran.com/login
https://app.ratel-quran.com/teacher/login
https://app.ratel-quran.com/admin/login
```

No existing public website route should be removed or redirected without explicit approval.

---

## 4. Environments

The platform must use separate environments.

---

## 4.1 Local Environment

Used by developers for local work.

### Purpose

- Develop application locally.
- Test UI and API behavior.
- Use fictional data only.
- Connect to local or staging Supabase project.
- Never connect to production database by default.

### Rules

- Use `.env.local`.
- Do not commit `.env.local`.
- Do not use production secrets locally unless explicitly approved.
- Use fictional seed data only.
- Do not use real child data.
- Do not send real parent or teacher notifications.
- Payment testing must use sandbox or fake links only.

### Local environment example

```text
http://localhost:3000
```

Required local variables should be documented in `.env.example`, but real values must never be committed.

---

## 4.2 Staging Environment

Used for pre-production validation.

### Purpose

- Test near-production behavior.
- Validate RLS and authorization.
- Test role-based dashboards.
- Test Fawaterk sandbox or controlled test flows.
- Test transactional email with safe recipients.
- Validate migrations before production.
- Run UAT with fictional or explicitly approved pilot data.

### Rules

- Must use separate Supabase project from production.
- Must use separate Vercel environment from production.
- Must use staging environment variables.
- Must not use production payment secrets.
- Must not use production child data unless owner approves a controlled pilot.
- Must pass testing checklist before production deployment.

### Staging URL

Suggested:

```text
https://staging-app-ratel.vercel.app
```

or another Vercel preview/staging domain.

---

## 4.3 Production Environment

Used by real users only after owner approval.

### Purpose

- Run the live operational platform.
- Serve parents, teachers, operations, finance, and admin users.
- Store real operational data after security approval.
- Use production Supabase project.
- Use production Fawaterk configuration if integrated.

### Rules

- Production deployment requires explicit owner approval.
- Production must not use fictional test credentials as real users.
- RLS must be enabled before real child data enters the system.
- Permission tests must pass before production use.
- Audit logging must be working before real child data is imported.
- Database backups must be configured.
- Rollback plan must be documented and tested.
- Secrets must be stored only in Vercel/Supabase dashboards or approved secret managers.

### Production URL

```text
https://app.ratel-quran.com
```

---

## 5. Vercel Deployment Strategy

### Approved use

Vercel is approved for hosting the Next.js operational platform.

### Deployment model

Recommended model:

```text
GitHub repository → Vercel project → Preview deployments → Production deployment
```

### Branch strategy

Recommended:

| Branch | Purpose | Deployment |
|---|---|---|
| `main` | Approved stable branch | Production only after approval |
| feature branches | Individual tasks | Preview deployments |
| documentation branches | Docs only | Preview optional |

### Preview deployments

Every pull request may create a Vercel preview deployment.

Preview deployments are useful for:

- UI review.
- Role dashboard review.
- Layout and RTL review.
- Testing registration forms.
- Testing non-production workflows.

Preview deployments must not:

- Use production secrets.
- Connect to production database.
- Send real notifications.
- Process real payments.
- Contain real child data.

### Production deployment

Production deployment must be gated by:

1. Owner approval.
2. Passing tests.
3. Passing permission checks.
4. Passing RLS checks.
5. Confirmed backups.
6. Confirmed rollback plan.
7. Confirmed environment variables.

---

## 6. Supabase Project Strategy

### Required Supabase projects

Use separate projects:

| Environment | Supabase Project | Data Type |
|---|---|---|
| Local | Local Supabase or staging project | Fictional only |
| Staging | Dedicated staging project | Fictional or approved pilot data |
| Production | Dedicated production project | Real data after approval |

### Supabase responsibilities

Supabase will provide:

- PostgreSQL database.
- Supabase Auth.
- Row-Level Security.
- Database backups.
- Auth user management.
- Optional storage if approved later.

### Supabase rules

- RLS must be enabled on all sensitive tables.
- Service role key must never be exposed to the browser.
- Production project must be protected.
- Production access must be limited.
- Database backups must be configured before real data.
- Any schema migration must be tested in staging first.

---

## 7. Environment Variables Strategy

Environment variables must be separated by environment.

### Required categories

1. Application URLs.
2. Supabase configuration.
3. Authentication configuration.
4. Fawaterk configuration.
5. Email service configuration.
6. Monitoring configuration.
7. Security and rate-limiting configuration.

### Example `.env.example`

The repository may include `.env.example` later with placeholders only:

```env
# Application
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_PUBLIC_SITE_URL=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Auth
AUTH_COOKIE_NAME=
SESSION_SECRET=

# Fawaterk
FAWATERK_API_KEY=
FAWATERK_WEBHOOK_SECRET=
FAWATERK_BASE_URL=

# Email
EMAIL_PROVIDER=
EMAIL_API_KEY=
EMAIL_FROM=

# Monitoring
SENTRY_DSN=
LOG_LEVEL=

# Security
RATE_LIMIT_MAX_REQUESTS=
RATE_LIMIT_WINDOW_SECONDS=
```

### Rules

- `.env.example` may contain placeholders only.
- `.env.local` must never be committed.
- Production values must be stored in Vercel dashboard or approved secret manager.
- Supabase service role key must be server-only.
- Fawaterk API key must be server-only.
- Webhook secrets must be server-only.
- No secret should appear in logs, screenshots, commits, pull requests, or issue comments.

---

## 8. Secrets Management Rules

### Never commit

The following must never be committed:

- Supabase service role key.
- Supabase database password.
- JWT or session secrets.
- Fawaterk API key.
- Fawaterk webhook secret.
- Email provider API key.
- Vercel tokens.
- Production database URL.
- Any password.
- Any private key.
- Any real payment credential.

### Approved locations for secrets

- Vercel environment variables.
- Supabase project dashboard.
- Approved secret manager if added later.
- Local `.env.local` for developer machines only.

### Secret rotation

Secrets should be rotated:

- After any suspected exposure.
- When a team member with access leaves.
- After production incident.
- At a regular interval defined by owner or technical lead.

Recommended minimum:

```text
Every 90 days for high-risk production secrets.
```

### Secret exposure response

If a secret is committed or exposed:

1. Revoke the secret immediately.
2. Rotate the secret.
3. Remove it from Git history if necessary.
4. Check logs for misuse.
5. Document incident.
6. Notify owner.
7. Do not deploy until resolved.

---

## 9. DNS Setup for app.ratel-quran.com

### Required DNS goal

Point:

```text
app.ratel-quran.com
```

to the Vercel application.

### Typical setup

In DNS provider:

```text
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

Exact DNS value may vary based on Vercel instructions.

### DNS checklist

- [ ] Confirm owner controls `ratel-quran.com` DNS.
- [ ] Add `app` subdomain in Vercel.
- [ ] Add DNS record in DNS provider.
- [ ] Wait for DNS propagation.
- [ ] Confirm SSL certificate is active.
- [ ] Confirm `https://app.ratel-quran.com` loads.
- [ ] Confirm no impact on `https://ratel-quran.com`.
- [ ] Confirm no existing public routes changed.

### Public website protection

DNS changes for `app.ratel-quran.com` must not modify:

- Root domain.
- Existing public website DNS.
- Existing payment routes.
- Existing contact/WhatsApp links.
- Existing SEO URLs.

---

## 10. Preview Deployment Rules

Preview deployments are allowed for review and testing.

### Allowed in preview

- UI review.
- RTL layout review.
- Role-based dashboard review.
- Fictional data testing.
- Registration form testing.
- Permission test review.
- Staging Supabase connection.
- Fawaterk sandbox testing if available.

### Forbidden in preview

- Production secrets.
- Production database.
- Real child data.
- Real payment processing.
- Real WhatsApp notifications to families.
- Public website DNS changes.
- Production deployment triggers.

### Preview environment checks

Before sharing preview link:

- [ ] Uses staging/local Supabase only.
- [ ] Uses fictional data only.
- [ ] No production secrets.
- [ ] No real payment links.
- [ ] Parent cannot see another child.
- [ ] Teacher cannot see unassigned student.
- [ ] Finance cannot see reports.
- [ ] Internal notes are hidden from unauthorized roles.

---

## 11. Production Deployment Approval Process

Production deployment requires explicit owner approval.

### Required approval

Owner approval must be recorded in GitHub issue, pull request, or approved deployment checklist.

### Required before production

- Documentation approved.
- Architecture approved.
- Database schema approved.
- Permissions approved.
- Testing strategy approved.
- Deployment strategy approved.
- RLS implemented and tested.
- Server-side authorization implemented and tested.
- Audit logging implemented and tested.
- No real child data in seed/test data.
- Backups configured.
- Rollback tested.
- Monitoring configured.
- Fawaterk integration verified.
- Public website remains untouched.

### Deployment approval comment template

```text
Owner approval granted for production deployment.

Approved:
- app.ratel-quran.com production deployment.
- Vercel production environment.
- Supabase production project.
- RLS and server-side authorization tested.
- No card data stored.
- Backup and rollback plan confirmed.
- Public website remains untouched.

Proceed with production deployment.
```

Without this approval, no production deployment is allowed.

---

## 12. Database Migration Deployment Rules

Database migrations must be handled carefully because the platform stores child and operational data.

### Migration rules

- No migration without review.
- No production migration without owner approval.
- Every migration must be tested in staging first.
- Every destructive migration must have rollback plan.
- Backups must run before production migration.
- RLS policies must be included with sensitive tables.
- Migration must not disable RLS in production.
- Seed data must be fictional unless owner approves real import.

### Migration sequence

Recommended order:

1. Create migration in development.
2. Test locally.
3. Apply to staging.
4. Run permission tests.
5. Run RLS tests.
6. Run API authorization tests.
7. Review migration diff.
8. Backup production.
9. Apply to production after owner approval.
10. Verify health checks and access rules.

### Destructive migrations

Destructive migrations include:

- Dropping tables.
- Dropping columns.
- Deleting rows.
- Changing foreign keys.
- Removing RLS policies.
- Changing role permissions.
- Truncating data.
- Changing payment records.

These require explicit approval and backup.

---

## 13. Rollback Strategy

Rollback is required for both application and database changes.

---

## 13.1 Application rollback

Vercel supports rollback to a previous deployment.

### Application rollback steps

1. Identify failed deployment.
2. Open Vercel deployment dashboard.
3. Promote previous known-good deployment.
4. Verify `app.ratel-quran.com` loads.
5. Verify login works.
6. Verify key role dashboards.
7. Document incident.
8. Create follow-up issue.

### Application rollback target time

Recommended:

```text
Rollback within 5–15 minutes for critical production failure.
```

---

## 13.2 Database rollback

Database rollback is more sensitive.

### Database rollback requirements

- Backup before migration.
- Reversible migration where possible.
- Staging verification before production.
- No destructive operation without backup.
- Manual rollback plan documented in PR.

### Database rollback steps

1. Stop affected feature if possible.
2. Disable relevant UI action if needed.
3. Restore from backup or run down migration.
4. Verify data integrity.
5. Verify RLS policies.
6. Verify permissions.
7. Document incident.
8. Notify owner.

---

## 14. Backup and Recovery Strategy

Backups must be configured before real child data is stored.

### Backup requirements

- Supabase production backups enabled.
- Backup frequency confirmed.
- Restore process tested.
- Backup retention policy approved.
- Critical data export procedure documented.
- Owner knows who can trigger restore.

### Recommended backup policy

| Data Type | Backup Requirement |
|---|---|
| User profiles | Daily backup |
| Parent/student records | Daily backup |
| Schedules/sessions | Daily backup |
| Reports | Daily backup |
| Payments/subscriptions | Daily backup |
| Requests | Daily backup |
| Audit logs | Daily or continuous backup if available |

### Recovery objectives

Owner must approve:

- RTO: Recovery Time Objective.
- RPO: Recovery Point Objective.

Suggested starting targets:

```text
RTO: 4 hours
RPO: 24 hours
```

These targets may be adjusted based on cost and operational needs.

---

## 15. Monitoring and Error Tracking

Monitoring must be configured before production.

### Required monitoring

- Application uptime.
- API errors.
- Authentication failures.
- Database errors.
- RLS or permission failures.
- Payment webhook failures.
- Email delivery failures.
- Slow API routes.
- Failed scheduled jobs, if added.
- Production deployment status.

### Recommended tools

Final tool choice is still open. Possible options:

- Vercel logs.
- Supabase logs.
- Sentry.
- Better Stack.
- Logtail.
- UptimeRobot.
- Pingdom.

### Alerts

Alerts should notify the owner or responsible operator when:

- Application is down.
- Login fails broadly.
- Payment webhook fails.
- Database connection fails.
- RLS policy error spikes.
- Email sending fails.
- Unusual unauthorized access attempts occur.

---

## 16. Security Checks Before Deployment

Before any production deployment, verify:

- [ ] No secrets committed.
- [ ] `.env.example` contains placeholders only.
- [ ] Production environment variables are set in Vercel.
- [ ] Supabase service role key is server-only.
- [ ] Fawaterk API key is server-only.
- [ ] Webhook secrets are server-only.
- [ ] RLS enabled on sensitive tables.
- [ ] Server-side authorization implemented.
- [ ] Parent isolation tests pass.
- [ ] Teacher isolation tests pass.
- [ ] Finance restriction tests pass.
- [ ] Internal notes are hidden from unauthorized roles.
- [ ] Audit logs are working.
- [ ] Rate limiting configured for public forms and login.
- [ ] No real child data in test fixtures.
- [ ] No card data fields exist.
- [ ] Error messages do not leak internals.
- [ ] Production deployment approved.

---

## 17. Public Website Protection Rules

The public website at:

```text
https://ratel-quran.com
```

must remain untouched unless explicitly approved.

### Must not change without approval

- Homepage.
- Existing routes.
- Existing SEO structure.
- Existing content.
- Existing design.
- Existing payment links.
- Existing WhatsApp links.
- Existing course pages.
- Existing testimonials.
- Existing contact methods.

### Allowed later with approval

Only after platform readiness, the public website may add links to:

- Family registration.
- Family login.
- Teacher login.
- Admin login.

These changes should be minimal and reversible.

---

## 18. Fawaterk Deployment Considerations

Fawaterk remains the external payment processor.

### Platform responsibilities

The platform may store:

- Payment status.
- Payment due date.
- External payment link.
- Receipt link.
- External reference.
- Subscription status.

The platform must not store:

- Card number.
- CVV.
- Full PAN.
- Raw card details.
- Payment processor secret in frontend.
- Sensitive webhook secrets in logs.

### Deployment requirements for Fawaterk

Before enabling production payment flows:

- [ ] Confirm Fawaterk production credentials.
- [ ] Confirm sandbox/test mode if available.
- [ ] Store API key server-side only.
- [ ] Store webhook secret server-side only.
- [ ] Validate webhook signatures.
- [ ] Test paid payment update.
- [ ] Test failed payment update.
- [ ] Test duplicate webhook handling.
- [ ] Test parent payment link visibility.
- [ ] Confirm teacher has no payment access.
- [ ] Confirm finance can update payment status.

---

## 19. Go-Live Checklist

Before go-live, all items must be complete.

### Documentation

- [ ] `AGENTS.md` approved.
- [ ] `TECHNICAL_AUDIT.md` approved.
- [ ] `ARCHITECTURE_DECISIONS.md` approved.
- [ ] `ARCHITECTURE.md` approved.
- [ ] `DATABASE_SCHEMA.md` approved.
- [ ] `PERMISSIONS.md` approved.
- [ ] `TESTING.md` approved.
- [ ] `DEPLOYMENT.md` approved.

### Infrastructure

- [ ] Vercel project created.
- [ ] Supabase staging project created.
- [ ] Supabase production project created.
- [ ] DNS configured for `app.ratel-quran.com`.
- [ ] SSL active.
- [ ] Environment variables configured.
- [ ] Backups enabled.
- [ ] Monitoring configured.

### Security

- [ ] RLS implemented.
- [ ] Permission tests pass.
- [ ] API authorization tests pass.
- [ ] Audit logging works.
- [ ] No card data stored.
- [ ] Secrets are not committed.
- [ ] Public website untouched.

### Operational

- [ ] Admin user created securely.
- [ ] Operations user created securely.
- [ ] Finance user created securely.
- [ ] Teacher pilot user created.
- [ ] Parent pilot user created.
- [ ] Fictional seed data verified.
- [ ] Training notes prepared.
- [ ] Support process defined.

### Owner approval

- [ ] Owner approval recorded.
- [ ] Production deployment window selected.
- [ ] Rollback owner identified.
- [ ] Post-deploy validation checklist ready.

---

## 20. Owner Approval Checklist

Before deployment implementation begins, the owner must approve:

- [ ] Vercel as application host.
- [ ] Supabase as database/auth/RLS provider.
- [ ] `app.ratel-quran.com` as operational domain.
- [ ] Public website protection rules.
- [ ] Local/staging/production environment strategy.
- [ ] Environment variable and secrets strategy.
- [ ] DNS setup approach.
- [ ] Preview deployment rules.
- [ ] Production approval process.
- [ ] Database migration deployment rules.
- [ ] Rollback strategy.
- [ ] Backup and recovery strategy.
- [ ] Monitoring and alerting approach.
- [ ] Fawaterk deployment considerations.
- [ ] Go-live checklist.
- [ ] No production deployment without explicit approval.

---

## 21. Implementation Non-Goals

This document does not:

- Create a Vercel project.
- Create a Supabase project.
- Configure DNS.
- Create environment variables.
- Create `.env.example`.
- Create migrations.
- Create database tables.
- Create application code.
- Add dependencies.
- Deploy staging.
- Deploy production.
- Modify the public website.
- Import real child data.

This document only defines the deployment strategy that must be approved before implementation.

---

**Status**: Draft — awaiting owner approval.  
**Next Step**: Review and approve before creating deployment configuration, environment files, infrastructure, migrations, or application code.
