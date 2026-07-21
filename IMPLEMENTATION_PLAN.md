# IMPLEMENTATION_PLAN.md: Rattel Operational Platform

**Document Version**: 1.0  
**Last Updated**: 21 July 2026  
**Status**: Draft — awaiting owner approval  
**Scope**: Implementation planning documentation only. No application code, dependencies, migrations, database tables, environment files, deployment configuration, or infrastructure have been created.

---

## 1. Implementation Overview

This document defines the step-by-step implementation plan for the Rattel operational platform.

The operational platform will be built as a separate SaaS application at:

```text
https://app.ratel-quran.com
```

The public website remains untouched at:

```text
https://ratel-quran.com
```

The approved direction is:

- Next.js + TypeScript for the application.
- Vercel for hosting.
- Supabase PostgreSQL for database.
- Supabase Auth for authentication.
- Supabase Row-Level Security for database-level access control.
- Server-side authorization for every protected action.
- Fawaterk remains external for payment processing.
- No card data is stored.
- Fictional seed data only until permissions and RLS tests pass.
- No production deployment without explicit owner approval.

This document is a plan only. It does not implement anything.

---

## 2. Source Documents

Implementation must follow these documents:

- `AGENTS.md`
- `TECHNICAL_AUDIT.md`
- `ARCHITECTURE_DECISIONS.md`
- `ARCHITECTURE.md`
- `DATABASE_SCHEMA.md`
- `PERMISSIONS.md`
- `TESTING.md`
- `DEPLOYMENT.md`

If any conflict exists between documents, stop and request owner clarification before implementation.

---

## 3. Implementation Principles

All implementation must follow these principles:

1. **Documentation-first**
   - No code begins until the relevant documentation is approved.

2. **Small phases**
   - Work must be broken into controlled phases.
   - Each phase should produce reviewable changes.

3. **No broad uncontrolled changes**
   - Avoid large commits that mix infrastructure, database, UI, and permissions.

4. **Security-first**
   - Authentication, authorization, RLS, and audit logging are not optional.

5. **Child-data protection**
   - No real child data may be used before RLS and permission tests pass.

6. **Frontend is not security**
   - UI hiding must be backed by server-side checks and RLS.

7. **Production requires explicit approval**
   - Passing tests does not automatically allow production deployment.

8. **Public website remains untouched**
   - `ratel-quran.com` must not be modified without explicit approval.

---

## 4. Approved Implementation Sequence

Implementation should proceed in this order:

1. Repository preparation.
2. Next.js project scaffold.
3. Environment variable placeholders.
4. Supabase staging setup.
5. Database migration planning.
6. Database schema implementation.
7. Row-Level Security implementation.
8. Authentication implementation.
9. Server-side authorization implementation.
10. Role-based routing and layouts.
11. Admin dashboard.
12. Operations dashboard.
13. Teacher dashboard.
14. Parent dashboard.
15. Finance dashboard.
16. Public registration form.
17. Request workflows.
18. Session and report workflows.
19. Subscription and payment tracking.
20. Notifications.
21. Audit logging.
22. Testing.
23. Staging deployment.
24. Owner review.
25. Production preparation.
26. Production deployment only after approval.

---

## 5. Phase 0 — Owner Approval Gate

### Goal

Confirm that all planning documents are reviewed and approved before implementation begins.

### Required before starting code

- [ ] `AGENTS.md` reviewed.
- [ ] `TECHNICAL_AUDIT.md` reviewed.
- [ ] `ARCHITECTURE_DECISIONS.md` approved.
- [ ] `ARCHITECTURE.md` approved.
- [ ] `DATABASE_SCHEMA.md` approved.
- [ ] `PERMISSIONS.md` approved.
- [ ] `TESTING.md` approved.
- [ ] `DEPLOYMENT.md` approved.
- [ ] `IMPLEMENTATION_PLAN.md` approved.

### Output

No code output.

### Stop condition

Stop until the owner explicitly approves moving to implementation.

---

## 6. Phase 1 — Repository Preparation

### Goal

Prepare the repository for controlled implementation.

### Tasks

- Review current repository state.
- Confirm no unexpected files exist.
- Confirm current branch.
- Confirm `main` is stable.
- Confirm issue workflow.
- Confirm commit and PR conventions.
- Confirm that documentation files are present.

### Allowed changes

Only if approved:

- Add `README.md`.
- Add `.gitignore`.
- Add `.env.example` with placeholders only.
- Add project metadata if needed.

### Forbidden

- Do not install dependencies yet unless approved.
- Do not create a database.
- Do not create migrations.
- Do not deploy.
- Do not modify the public website.

### Completion criteria

- Repository baseline confirmed.
- Required docs exist.
- Owner approves moving to scaffold phase.

---

## 7. Phase 2 — Next.js Project Scaffold

### Goal

Create the initial Next.js + TypeScript application structure.

### Tasks

- Create Next.js project.
- Use TypeScript.
- Add basic folder structure.
- Configure linting if included in scaffold.
- Add minimal app shell.
- Add RTL-ready layout foundation.
- Add placeholder routes only if approved.

### Suggested initial routes

```text
/
```

Optional later routes:

```text
/login
/register
/admin
/operations
/finance
/teacher
/parent
```

### Required constraints

- No real authentication yet.
- No real database access yet.
- No real child data.
- No payment integration.
- No production deployment.

### Completion criteria

- App runs locally.
- No secrets committed.
- No sensitive data added.
- Public website untouched.

---

## 8. Phase 3 — Environment Variable Placeholders

### Goal

Document required environment variables safely.

### Tasks

Create `.env.example` with placeholders only.

### Allowed placeholder categories

- App URLs.
- Supabase public URL.
- Supabase anon key placeholder.
- Server-only Supabase service role placeholder.
- Auth/session placeholders.
- Fawaterk placeholders.
- Email placeholders.
- Monitoring placeholders.
- Rate-limit placeholders.

### Forbidden

- No real secret values.
- No production database URL.
- No real Fawaterk key.
- No Supabase service role key.
- No Vercel token.
- No real email API key.

### Completion criteria

- `.env.example` contains placeholders only.
- `.env.local` is gitignored.
- Secret rules are documented.

---

## 9. Phase 4 — Supabase Staging Setup

### Goal

Create or connect a staging Supabase project for safe testing.

### Tasks

- Create staging Supabase project.
- Configure Supabase Auth settings.
- Confirm database access.
- Confirm staging environment variables.
- Confirm no production data exists.
- Confirm service role key is server-only.

### Required constraints

- Staging only.
- Fictional data only.
- No production child data.
- No production payment credentials.

### Completion criteria

- Staging Supabase project ready.
- Auth configuration reviewed.
- Owner confirms staging setup.

---

## 10. Phase 5 — Database Migration Planning

### Goal

Prepare database migrations based on `DATABASE_SCHEMA.md`.

### Tasks

- Convert logical schema into migration plan.
- Review table creation order.
- Review enum strategy.
- Review foreign key strategy.
- Review index strategy.
- Review audit log table strategy.
- Review RLS policy sequence.

### Required order

Recommended:

1. Enums.
2. Core profile tables.
3. Parent/teacher/student tables.
4. Lead and assessment tables.
5. Enrollment and scheduling tables.
6. Session and report tables.
7. Subscription and payment tables.
8. Request and notification tables.
9. Audit logs.
10. Indexes.
11. RLS enablement.
12. RLS policies.
13. Seed data.

### Forbidden

- No production migration.
- No real data import.
- No destructive migration.

### Completion criteria

- Migration plan reviewed.
- Owner approves schema implementation.

---

## 11. Phase 6 — Database Schema Implementation

### Goal

Create database tables in staging only.

### Tasks

- Create migrations for approved schema.
- Apply migrations to staging.
- Verify tables.
- Verify foreign keys.
- Verify indexes.
- Verify required fields.
- Verify no card fields exist.

### Required safety checks

- No card number field.
- No CVV field.
- No full PAN field.
- No real child data.
- No production database connection.

### Completion criteria

- Schema exists in staging.
- Schema matches `DATABASE_SCHEMA.md`.
- No sensitive payment card fields exist.
- Owner approves continuing to RLS.

---

## 12. Phase 7 — Row-Level Security Implementation

### Goal

Implement RLS policies for all sensitive tables.

### Tasks

- Enable RLS on all application tables.
- Implement role resolution.
- Implement parent ownership policies.
- Implement teacher assignment policies.
- Implement finance payment/subscription policies.
- Implement operations policies.
- Implement admin policies.
- Deny anonymous access except approved public lead submission path.

### Required RLS tests

- Parent A cannot see Parent B child.
- Teacher A cannot see Teacher B student.
- Finance cannot see session reports.
- Teacher cannot see payments.
- Parent cannot see internal notes.
- Anonymous cannot list sensitive tables.

### Completion criteria

- RLS enabled.
- RLS tests pass in staging.
- Owner approves continuing to auth/API.

---

## 13. Phase 8 — Authentication Implementation

### Goal

Implement Supabase Auth-based login and session handling.

### Tasks

- Configure auth client.
- Configure server-side session reading.
- Create login flow.
- Create logout flow.
- Create role-aware session handling.
- Create protected route behavior.
- Create inactive/suspended account behavior.

### Required roles

- Admin
- Operations
- Finance
- Teacher
- Parent

### Completion criteria

- Users can log in.
- Users can log out.
- Role is resolved server-side.
- Suspended users are blocked.
- Unauthenticated users are redirected or denied.

---

## 14. Phase 9 — Server-Side Authorization

### Goal

Implement server-side permission checks for all protected actions.

### Tasks

- Create authorization helpers.
- Validate role per action.
- Validate record ownership.
- Validate teacher assignment.
- Validate parent-child relationship.
- Validate finance scope.
- Filter restricted fields.
- Return safe errors.

### Required rules

- Parent only sees own children.
- Teacher only sees assigned students.
- Finance only sees payment/subscription scope.
- Operations manages operational workflows.
- Admin has full access with audit logging.
- Restricted fields must never leak.

### Completion criteria

- API authorization tests pass.
- Restricted fields are filtered.
- Unauthorized access returns safe errors.
- Audit logging hooks identified.

---

## 15. Phase 10 — Role-Based Routing and Layouts

### Goal

Create role-specific navigation and layouts.

### Routes

Suggested routes:

```text
/admin
/operations
/finance
/teacher
/parent
```

### Tasks

- Create shared authenticated layout.
- Create role-specific navigation.
- Hide unauthorized navigation items.
- Add server-side route protection.
- Add unauthorized access page or redirect behavior.
- Ensure RTL-first design.

### Important

Frontend visibility is convenience only. Server-side and RLS protections must already exist.

### Completion criteria

- Each role sees correct dashboard shell.
- Unauthorized roles cannot access other dashboards.
- UI is RTL-ready.
- No sensitive data leaks.

---

## 16. Phase 11 — Admin Dashboard

### Goal

Build Admin management views.

### Features

- User overview.
- Role management.
- Account status management.
- Parent/student/teacher overview.
- Request overview.
- Payment/subscription overview.
- Audit log viewer.
- System status overview.

### Restrictions

- Admin actions must be audit logged.
- Role changes must be audit logged.
- No secrets displayed in UI.

### Completion criteria

- Admin can manage platform records.
- Role changes are logged.
- Sensitive actions are logged.

---

## 17. Phase 12 — Operations Dashboard

### Goal

Build operational management workflows.

### Features

- Lead management.
- Assessment tracking.
- Parent/student creation.
- Teacher assignment.
- Teacher availability.
- Schedule management.
- Session tracking.
- Report review.
- Request handling.
- At-risk student follow-up.

### Completion criteria

- Operations can manage learning operations.
- Operations cannot access payment secrets.
- Internal notes are hidden from parents and teachers.

---

## 18. Phase 13 — Teacher Dashboard

### Goal

Build teacher-facing workflows.

### Features

- Today’s sessions.
- Weekly schedule.
- Assigned students.
- Session report form.
- Attendance marking.
- Own requests.
- Availability view or edit if approved.

### Restrictions

- Teacher sees assigned students only.
- Teacher cannot see payments.
- Teacher cannot see unassigned students.
- Teacher cannot see admin-only notes.

### Completion criteria

- Teacher access isolation passes.
- Teacher can submit reports for own sessions only.
- Teacher cannot access finance data.

---

## 19. Phase 14 — Parent Dashboard

### Goal

Build parent-facing workflows.

### Features

- Family dashboard.
- Child selector.
- Child schedule.
- Upcoming sessions.
- Parent-visible reports.
- Homework.
- Requests.
- Subscription/payment status.
- External payment link.

### Restrictions

- Parent sees own children only.
- Parent cannot see admin notes.
- Parent cannot see another family.
- Parent cannot directly edit schedules.

### Completion criteria

- Parent isolation passes.
- Parent-visible reports are correctly filtered.
- Payment link visibility is limited to own family.

---

## 20. Phase 15 — Finance Dashboard

### Goal

Build finance-facing payment and subscription workflows.

### Features

- Subscription list.
- Payment list.
- Payment status update.
- Due/overdue tracking.
- External payment links.
- Receipt links.
- Payment-related requests.

### Restrictions

- Finance cannot see educational reports.
- Finance cannot see teacher internal notes.
- Finance cannot assign teachers.
- Finance cannot update schedules.
- No card data is stored or displayed.

### Completion criteria

- Finance can manage payment tracking.
- Finance cannot access educational content.
- Payment safety tests pass.

---

## 21. Phase 16 — Public Registration Form

### Goal

Create safe public lead registration.

### Features

- Parent name.
- Email.
- WhatsApp.
- Country/timezone.
- Child name.
- Child age.
- Child gender.
- Requested service.
- Suitable days/times.
- Privacy consent.

### Security requirements

- Server-side validation.
- Rate limiting.
- Spam protection.
- Duplicate detection.
- Create-only access.
- No public lead listing.
- No role assignment from public form.

### Completion criteria

- Valid lead submission works.
- Invalid submissions are rejected.
- Anonymous users cannot read leads.

---

## 22. Phase 17 — Request Workflows

### Goal

Implement parent, teacher, operations, and finance request workflows.

### Request types

- Parent leave.
- Teacher leave.
- Makeup session.
- Schedule change.
- Pause subscription.
- Resume subscription.
- Change session count.
- Complaint.
- General inquiry.

### Completion criteria

- Request ownership enforced.
- Internal notes hidden.
- User-visible responses shown correctly.
- Approvals/rejections logged.

---

## 23. Phase 18 — Session and Report Workflows

### Goal

Implement lesson session and reporting workflows.

### Features

- Session generation or creation.
- Attendance status.
- Session completion.
- Teacher report submission.
- Parent-safe report visibility.
- Intervention-needed flag.
- Report edit window.

### Completion criteria

- Teacher submits only own reports.
- Parent sees only parent-safe fields.
- Finance cannot access reports.
- Reports are audit logged.

---

## 24. Phase 19 — Subscription and Payment Tracking

### Goal

Track subscriptions and external payment status safely.

### Features

- Subscription records.
- Payment records.
- External payment link.
- Receipt link.
- Payment status.
- Due date.
- Overdue status.
- Finance workflow.

### Fawaterk rules

- Fawaterk remains external.
- No card data stored.
- API keys are server-only.
- Webhook secrets are server-only.
- Webhook verification required before production.

### Completion criteria

- Finance can update payment status.
- Parent can see own payment link.
- Teacher cannot see payments.
- No card fields exist.

---

## 25. Phase 20 — Notifications

### Goal

Implement safe notifications.

### Channels

- In-app notifications.
- Email.
- WhatsApp links or integration if approved later.

### Rules

- Avoid sensitive child details in external notifications.
- Do not expose internal notes.
- Do not send real notifications in staging.
- Log notification failures.

### Completion criteria

- Notifications are role-scoped.
- External notification content is minimal.
- Failures are tracked.

---

## 26. Phase 21 — Audit Logging

### Goal

Log sensitive actions across the platform.

### Must log

- Login success/failure.
- Password reset request.
- Role change.
- User invite.
- Student profile view by staff.
- Student profile update.
- Teacher assignment change.
- Schedule changes.
- Session report creation/update.
- Request approval/rejection.
- Payment status changes.
- Subscription status changes.
- Data export if added.

### Must not log

- Passwords.
- Tokens.
- API secrets.
- Card data.
- Full private child notes in unsafe logs.

### Completion criteria

- Required actions create audit logs.
- Audit logs are visible to Admin only unless approved.
- Logs do not expose secrets.

---

## 27. Phase 22 — Testing

### Goal

Run all required tests before staging and production approval.

### Required test categories

- Parent access tests.
- Teacher access tests.
- Finance access tests.
- Operations access tests.
- Admin access tests.
- RLS tests.
- API authorization tests.
- Frontend visibility tests.
- Child data privacy tests.
- Payment safety tests.
- Audit logging tests.
- Public registration tests.
- Session report visibility tests.
- Request workflow tests.
- Migration and seed data tests.

### Completion criteria

- All critical tests pass.
- Negative permission tests pass.
- No real child data used.
- Owner approves moving to deployment.

---

## 28. Phase 23 — Staging Deployment

### Goal

Deploy the application to staging for review.

### Tasks

- Configure Vercel staging/preview.
- Configure staging environment variables.
- Connect staging Supabase.
- Run migrations in staging.
- Run RLS and permission tests.
- Perform UAT with fictional data.
- Validate RTL layout.
- Validate role dashboards.

### Completion criteria

- Staging works.
- Tests pass.
- No production secrets.
- No real child data.
- Owner approves production preparation.

---

## 29. Phase 24 — Production Preparation

### Goal

Prepare for production without deploying prematurely.

### Tasks

- Create production Supabase project.
- Configure production Vercel environment.
- Configure DNS for `app.ratel-quran.com`.
- Configure backups.
- Configure monitoring.
- Configure secrets.
- Confirm rollback.
- Confirm no public website impact.
- Confirm owner approval checklist.

### Completion criteria

- Production environment prepared.
- Deployment not executed until owner approval.
- Rollback plan confirmed.
- Owner signs off.

---

## 30. Phase 25 — Production Deployment

### Goal

Deploy production only after explicit owner approval.

### Required before deployment

- [ ] Owner approval recorded.
- [ ] RLS tests pass.
- [ ] Permission tests pass.
- [ ] API authorization tests pass.
- [ ] Audit logging works.
- [ ] Backups enabled.
- [ ] Monitoring enabled.
- [ ] Rollback plan ready.
- [ ] No card data stored.
- [ ] Public website untouched.

### Deployment steps

1. Confirm deployment window.
2. Confirm production environment variables.
3. Confirm Supabase production health.
4. Deploy from approved branch.
5. Verify `https://app.ratel-quran.com`.
6. Test login.
7. Test each role dashboard.
8. Test parent isolation.
9. Test teacher isolation.
10. Test finance restrictions.
11. Test audit logging.
12. Monitor errors.
13. Record deployment result.

### Completion criteria

- Production app is live.
- Critical checks pass.
- Owner confirms acceptance.

---

## 31. Phase 26 — Post-Launch Stabilization

### Goal

Monitor and stabilize the platform after launch.

### Tasks

- Monitor login issues.
- Monitor API errors.
- Monitor payment workflows.
- Monitor report submissions.
- Monitor request workflows.
- Review audit logs.
- Collect user feedback.
- Fix high-priority issues.
- Avoid unapproved feature expansion.

### Completion criteria

- Platform remains stable.
- Critical workflows confirmed.
- Owner approves next feature phase.

---

## 32. Branch and PR Strategy

### Recommended approach

- One issue per phase or feature.
- One branch per issue.
- One PR per branch.
- Keep PRs small and reviewable.
- Do not mix unrelated changes.

### Branch examples

```text
docs/implementation-plan
chore/scaffold-nextjs
feat/auth
feat/admin-dashboard
feat/teacher-dashboard
feat/parent-dashboard
feat/finance-dashboard
feat/public-registration
feat/session-reports
feat/payment-tracking
test/permissions
deploy/staging
```

### PR requirements

Every PR should include:

- Summary.
- Files changed.
- What was tested.
- Security impact.
- Data privacy impact.
- Screenshots if UI changed.
- Confirmation that no secrets were committed.

---

## 33. Definition of Done

A phase is done only when:

- The requested scope is complete.
- No unrelated files were changed.
- No secrets were committed.
- Tests relevant to the phase pass.
- Permission implications are reviewed.
- Child-data privacy is preserved.
- Documentation is updated if needed.
- Owner approval is obtained when required.

---

## 34. Stop Conditions

Stop implementation immediately if:

- A requirement conflicts with approved documentation.
- A secret is exposed.
- Real child data appears in test data.
- RLS is disabled or bypassed.
- Parent can see another family.
- Teacher can see unassigned student.
- Finance can see educational reports.
- Public website is affected unexpectedly.
- Production deployment is requested without approval.
- Payment card data is proposed for storage.

---

## 35. Owner Approval Checklist

Before implementation begins, the owner must approve:

- [ ] Implementation sequence.
- [ ] Phase-by-phase approach.
- [ ] Next.js scaffold phase.
- [ ] Supabase staging-first approach.
- [ ] Database migration order.
- [ ] RLS before real data.
- [ ] Server-side authorization before dashboards.
- [ ] Role dashboard order.
- [ ] Public registration safety requirements.
- [ ] Payment tracking without card data.
- [ ] Testing before deployment.
- [ ] Staging before production.
- [ ] Production only after explicit approval.
- [ ] Public website remains untouched.
- [ ] No real child data until permission tests pass.

---

## 36. Implementation Non-Goals

This document does not:

- Create a Next.js project.
- Add dependencies.
- Create environment files.
- Create Supabase project.
- Create database migrations.
- Create database tables.
- Create RLS policies.
- Create application code.
- Create test files.
- Configure Vercel.
- Configure DNS.
- Deploy staging.
- Deploy production.
- Import real data.
- Modify the public website.

This document only defines the implementation plan that must be approved before implementation begins.

---

**Status**: Draft — awaiting owner approval.  
**Next Step**: Review and approve before creating the Next.js project, dependencies, environment files, Supabase configuration, migrations, RLS policies, tests, or application code.
