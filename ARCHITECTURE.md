# ARCHITECTURE.md: Rattel Operational Platform

## 1. System Overview

The Rattel operational platform is a child-safe Quran education SaaS designed to manage up to 50 active students with room to scale. It connects the existing public Rattel marketing website (ratel-quran.com) with a dedicated operations platform accessible at app.ratel-quran.com. The system serves five user roles—Admin, Operations, Finance, Teacher, and Parent—each with appropriate access to student data, schedules, reports, subscriptions, and communication logs.

The architecture prioritizes:
- **Data security and privacy**: Children's data is protected at every layer (frontend UI, backend API, database RLS).
- **Operational simplicity**: Teachers and parents interact through clear, RTL-first interfaces requiring minimal training.
- **Integration safety**: The existing website remains untouched; the platform launches independently to avoid SEO or deployment disruption.
- **Financial safety**: No payment card data is stored; external payment processor handles transactions.

## 2. Approved Architecture Decisions

This platform is built on nine owner-approved architectural decisions:

1. **Subdomain Strategy**: Operational platform at app.ratel-quran.com; public site remains at ratel-quran.com.
2. **Technology Stack**: Next.js 14+ with TypeScript, PostgreSQL (Supabase), Vercel hosting.
3. **Authentication**: JWT in secure HTTP-only cookies; 15-minute access token, 7-day refresh token.
4. **Authorization**: Three-layer enforcement (frontend, backend API, database RLS policies).
5. **Database**: PostgreSQL with RLS policies enforcing row-level access control.
6. **Data Migration**: Parallel-run approach; seed data only initially, gradual transition over 2-4 weeks.
7. **External Payments**: Fawaterk remains the payment processor; platform tracks subscription status only.
8. **Audit Logging**: Sensitive operations logged to audit trail (logins, data access, submissions, updates).
9. **Development Phases**: Six phases from audit through launch, with testing and handover in phase 7.

## 3. Domain Strategy

### Subdomain Rationale

The operational platform is deployed to a separate subdomain for three reasons:

- **Risk isolation**: Separates the live public website from operational system deployments. A bug in the platform cannot crash the marketing site.
- **SEO preservation**: Distinct domain/subdomain structure avoids URL changes and duplicate content issues on the public site.
- **Operational independence**: Teams can deploy platform updates independently without coordinating with website maintenance windows.

### DNS and Entry Points

The public site (ratel-quran.com) provides entry points to the platform via updated navigation:

- Main navigation: "سجّلي طفلك" (Register Your Child) → /register
- Main navigation: "دخول الأسرة" (Family Login) → /login
- Footer or suitable area: "دخول المعلم" (Teacher Login) → /teacher

All entry points route to app.ratel-quran.com or equivalent subdomain.

## 4. Application Architecture

### Tech Stack

- **Frontend**: Next.js 14+ with React, TypeScript, Tailwind CSS (mobile-first, RTL support).
- **Backend**: Next.js API routes for business logic and data access.
- **Database**: PostgreSQL (Supabase) with RLS policies for data isolation.
- **Hosting**: Vercel for Next.js application, Supabase for PostgreSQL database.
- **Authentication**: Supabase Auth (JWT tokens).
- **Payments**: Fawaterk (external, never stored locally).
- **Email**: External service (to be specified) for notifications.

### Component Structure

The application is organized into the following logical areas:

1. **Admin Portal**: User management, student/teacher management, subscriptions, operational dashboard, reports, requests.
2. **Operations Portal**: Leads, student enrollment, teacher assignment, schedule management, leave/makeup requests, session attendance.
3. **Finance Portal**: Subscription tracking, payment status, payment link management, receipt handling.
4. **Teacher Dashboard**: Assigned students, session schedule, attendance marking, session reports, leave/makeup requests.
5. **Parent Portal**: Child profiles, session schedule, session reports, subscription status, leave/makeup/schedule-change requests.
6. **Public Registration Form**: Publicly accessible lead capture form with spam prevention and rate limiting.

### Data Flow

1. **Leads**: Public registration form → Database → Operations review → Acceptance/rejection.
2. **Students**: Accepted leads → Operations creates student profile → Teacher assigned → Schedules created.
3. **Sessions**: Automatically generated from recurring schedules → Sessions present to teacher and parent views.
4. **Reports**: Teacher submits report after session → Visible to parent (excluding admin notes) → Admin alerted if intervention needed.
5. **Requests**: Teacher/parent submits request → Operations reviews → Status updated → Notified parties react (schedule change, makeup session, etc.).
6. **Payments**: Subscription created → Payment link generated → External processor handles transaction → Status returned to platform.

## 5. Authentication and Authorization Architecture

### Authentication Flow

1. User enters credentials (email/password) on login page.
2. Backend validates credentials via Supabase Auth.
3. Supabase issues JWT tokens: access token (15 minutes), refresh token (7 days).
4. Tokens stored in secure HTTP-only cookies.
5. On API requests, backend verifies access token; if expired, refreshes automatically.
6. On session expiry, user redirected to login.

### Authorization Model

Authorization is enforced in three layers:

1. **Frontend UI**: Role-based navigation and form visibility (hides inaccessible routes).
2. **Backend API**: Every endpoint validates user role before returning data.
3. **Database RLS**: PostgreSQL row-level security policies prevent unauthorized data access even if backend validation is compromised.

Example: A teacher cannot query students assigned to another teacher. Backend API checks user's teacher ID; if mismatch, returns 403. RLS policy simultaneously prevents data access at the database level.

### Five Roles

| Role | Scope | Data Access | Can Modify |
|------|-------|-------|-----------|
| Admin | Full platform | All data | All records |
| Operations | Students, teachers, schedules, requests | All data (no payments) | Student, teacher, schedule, request records |
| Finance | Payments, subscriptions | Subscription and payment records only | Payment status, payment links |
| Teacher | Assigned students, own sessions, own requests | Only assigned students and own sessions | Attendance, session reports, own requests |
| Parent | Own children, own family data | Only own children and own family records | Leave/makeup/schedule-change requests |

## 6. Database Architecture Overview

### Core Tables

The platform uses PostgreSQL with the following main entities:

- **profiles**: Supabase Auth profiles (email, metadata, created_at).
- **parents**: Parent accounts (name, phone, country, timezone, preferred language, account status).
- **students**: Student records (name, parent, age, gender, reading level, memorization level, service, status, teacher, goal, risk level, admin notes).
- **teachers**: Teacher profiles (name, email, phone, gender, country, timezone, specializations, max students, available hours, availability slots, status, admin rating, internal notes).
- **leads**: Registration form submissions (parent name, WhatsApp, email, country, child name, age, gender, reading level, memorization, service, suitable times, lead status, created_at, updated_at).
- **assessments**: Teacher assessment records (lead, teacher, assessment date, notes, recommendation, created_at).
- **enrollments**: Links student to teacher and service path (student, teacher, service, enrollment date, status, end date, created_at).
- **teacher_availability**: Recurring availability slots (teacher, day of week, start_time, end_time, timezone, recurring).
- **schedules**: Recurring student-teacher appointments (student, teacher, day of week, start_time, end_time, timezone, meeting_link, schedule_status, start_date, end_date, created_by, created_at).
- **sessions**: Generated instances of schedules (student, teacher, schedule, session_date, session_status, meeting_link, created_at).
- **session_reports**: Post-session reports by teacher (session, teacher, date, attendance_status, material_reviewed, new_lesson, performance_level, engagement_level, homework, parent_note, admin_note, intervention_needed, intervention_reason, created_at, updated_at).
- **subscriptions**: Active subscription records (student, package, price, currency, session_count, start_date, renewal_date, subscription_status, discount, notes, created_at).
- **payments**: Payment tracking (subscription, amount, currency, due_date, paid_date, status, payment_method, payment_link, reference_number, receipt_link, created_at, updated_at).
- **requests**: Unified request tracking (requester, requester_role, student, teacher, session, type, reason, requested_date, suggested_alt_time, status, admin_notes, created_at, closed_at).
- **audit_logs**: Audit trail (user_id, action, table_name, record_id, old_values, new_values, timestamp).

### RLS Policies

Row-level security policies enforce data isolation:

- **Parents**: Can access only own children and family data.
- **Teachers**: Can access only assigned students and own sessions.
- **Finance**: Can access subscription and payment records; limited access to student metadata.
- **Operations**: Can access all student, teacher, and schedule data; limited access to payment details.
- **Admin**: Full access to all data.

## 7. Role-Based Access Model

### Admin Role

- **Access**: Full platform access.
- **Responsibilities**: User management, student/teacher management, subscriptions, operational dashboard, admin approvals, system monitoring.
- **Permissions**:
  - Create/update/delete users of all roles.
  - Create/update/delete students and teachers.
  - View all schedules, sessions, reports.
  - Approve/reject leads.
  - Manage subscriptions and payment tracking.
  - View audit logs.

### Operations Role

- **Access**: Leads, students, teachers, schedules, sessions, requests.
- **Responsibilities**: Lead qualification, student enrollment, teacher assignment, schedule management, follow-up.
- **Permissions**:
  - Convert leads to students.
  - Assign teachers to students.
  - Create and modify schedules.
  - Review and approve leave/makeup requests.
  - Track session attendance (through teacher submission).
  - View session reports.
  - Limited payment visibility (status only, not sensitive details).

### Finance Role

- **Access**: Subscriptions, payments, basic student metadata (name, enrollment status).
- **Responsibilities**: Payment tracking, subscription status, payment link management.
- **Permissions**:
  - View subscription records.
  - Update payment status.
  - Add/manage payment links.
  - Add/manage receipt links.
  - Generate payment reports.
  - Restricted: Cannot view teacher notes, session reports, or sensitive educational data.

### Teacher Role

- **Access**: Assigned students, own sessions, own requests.
- **Responsibilities**: Attendance marking, session reporting, leave/makeup requests.
- **Permissions**:
  - View only assigned students.
  - View own session schedule.
  - Record attendance and submit session reports (up to admin-configured edit window).
  - Submit leave or makeup requests.
  - View own requests and responses.
  - Restricted: Cannot see payments, fees, students assigned to other teachers, or other teacher data.

### Parent Role

- **Access**: Own children, own family data.
- **Responsibilities**: Monitoring child progress, requesting schedule changes, leave requests.
- **Permissions**:
  - View own children (parent can have multiple).
  - View child schedule.
  - View child session reports (excluding internal admin notes).
  - View subscription status and payment status.
  - Submit leave, makeup, and schedule-change requests.
  - Restricted: Cannot see other families' data, fee details, teacher notes, or sibling data (can only see own child).

## 8. Security and Privacy Model

### Data Protection Principles

1. **Minimize Collection**: Collect only data necessary to run the platform (no surplus fields or tracking).
2. **Encrypt in Transit**: All API communication over HTTPS.
3. **Encrypt at Rest**: PostgreSQL at-rest encryption via Supabase.
4. **Protect Sensitive Data**: Never store payment card data, CVV, or encryption keys in the database.
5. **Log Sensitive Events**: Audit trail records logins, data access, report submissions, payment updates.

### Authentication Security

- Passwords hashed by Supabase Auth (bcrypt equivalent).
- Access tokens short-lived (15 minutes); refresh tokens longer (7 days).
- Refresh tokens stored in HTTP-only, Secure, SameSite cookies (no JavaScript access).
- CSRF protection via SameSite cookie policy.
- Rate limiting on login endpoint to prevent brute force.

### API Security

- All routes require valid access token.
- Role-based access checks at every endpoint.
- Input validation (schema validation, rate limiting, CORS).
- Output filtering (never return sensitive admin notes to non-admin users).
- Request/response logging (sanitized for audit trail).

### Public Form Security

- Rate limiting on registration form submission (e.g., 5 submissions per IP per hour).
- CAPTCHA or similar spam prevention.
- Server-side validation (reject malformed data).
- Reasonable deduplication (prevent duplicate submissions from same email/phone within 24 hours).

### Secrets Management

- Environment variables store all sensitive configuration (database URL, JWT secret, API keys).
- No secrets committed to Git.
- `.env.example` provided with placeholder values (no real secrets).
- Different environment variables per deployment environment (local, staging, production).
- Secrets rotated per security policy (minimum: quarterly).

### Access Control Enforcement

- Authorization checked server-side, never frontend-only.
- Database RLS policies provide additional enforcement layer.
- No bulk operations that bypass row-level checks.
- Audit logs record all administrative actions.

## 9. External Integrations

### Supabase (Database & Auth)

- Hosts PostgreSQL database with RLS.
- Provides JWT-based authentication via Supabase Auth.
- Handles email verification and password reset flows.
- Configuration: Project URL and API keys in environment variables.

### Fawaterk (Payment Processor)

- External payment link generation and transaction processing.
- Platform tracks subscription and payment status; never handles card data.
- Integration: Platform generates payment link via Fawaterk API; directs parent to external payment page.
- On payment completion, Fawaterk notifies platform via webhook to update payment status.
- Configuration: API key in environment variables.

### Email Service (TBD)

- Sends transactional emails (password reset, enrollment confirmation, report notifications, etc.).
- All email templates in the platform; service is a transport layer only.
- Configuration: Service credentials in environment variables.
- Avoid: Sending sensitive data (payment details, internal notes) via email unless necessary for parent communication.

### Vercel (Hosting)

- Hosts Next.js application.
- Automatic deployments from Git branch or manual trigger.
- Environment variables configured in Vercel dashboard.
- Log streaming and error monitoring available.

### Audit and Compliance

- All external integrations log data access (which records accessed, when, by whom).
- Integrations follow GDPR/CCPA principles (minimal data sharing, easy data retrieval/deletion).
- No third-party analytics or tracking scripts that identify children.

## 10. Deployment Architecture

### Development Environment

- Local machine with Node.js 18+, pnpm, PostgreSQL (local or Docker).
- `.env.local` file with local database credentials, test API keys.
- Development server: `pnpm dev` (runs on localhost:3000 by default).

### Staging Environment

- Separate Supabase project and Vercel preview deployments.
- Real data (or production-like seed data) for testing.
- Full testing of payment flows (using sandbox credentials).
- Testing of email delivery.

### Production Environment

- Supabase production project with automated backups and replication.
- Vercel production deployment with performance monitoring.
- Custom domain: app.ratel-quran.com.
- SSL/TLS certificate (automatic via Vercel).
- WAF and DDoS protection (via Vercel/Cloudflare).

### Deployment Process

1. Code changes committed to feature branch.
2. Pull request created; code review and tests run (CI).
3. On approval, PR merged to main branch.
4. Vercel automatically deploys main branch to production.
5. Database migrations run (via Supabase CLI or Vercel build hook).
6. Deployment completion verified via health check.

### Rollback Plan

- Vercel allows one-click rollback to previous production deployment.
- Database migrations are reversible (down migration scripts exist).
- If critical bug discovered post-deployment, rollback within 5 minutes; then investigate and fix.

## 11. Environment Variables Strategy

### Configuration by Tier

Environment variables are organized by deployment tier (local, staging, production). Required variables:

**Authentication & Database**
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public Supabase API key (safe for frontend).
- `SUPABASE_SERVICE_ROLE_KEY`: Server-side Supabase key (for admin operations, never exposed to frontend).
- `JWT_SECRET`: Secret for custom JWT signing (if needed; Supabase Auth handles this by default).

**Application**
- `NEXT_PUBLIC_APP_URL`: App base URL (used for links, redirects; e.g., https://app.ratel-quran.com in production).
- `NODE_ENV`: "development", "staging", or "production".

**External Services**
- `FAWATERK_API_KEY`: Fawaterk API key (production only; sandbox key for staging).
- `FAWATERK_WEBHOOK_SECRET`: Secret for validating Fawaterk webhooks.
- `EMAIL_SERVICE_API_KEY`: Email service API key (SendGrid, Resend, AWS SES).
- `EMAIL_FROM`: From address for transactional emails (e.g., notifications@ratel-quran.com).

**Optional / Future**
- `SENTRY_DSN`: Error tracking service (if used).
- `LOG_LEVEL`: Verbosity for application logs (debug, info, warn, error).

### Management

- `.env.local` used for local development (never committed).
- `.env.example` committed with placeholder values (no real secrets).
- Staging and production variables stored in Vercel dashboard or Supabase environment configuration.
- Variables rotated quarterly and after any suspected compromise.

## 12. Audit Logging Strategy

### Audit Trail Table

The `audit_logs` table records sensitive operations:

| Column | Type | Purpose |
|--------|------|---------|
| id | UUID | Primary key |
| user_id | UUID | User who performed action |
| action | TEXT | Action type (e.g., "create", "update", "delete", "login") |
| table_name | TEXT | Table affected (e.g., "students", "payments") |
| record_id | UUID | Record ID affected |
| old_values | JSONB | Previous values (for updates) |
| new_values | JSONB | New values (for updates) |
| timestamp | TIMESTAMP | When action occurred |
| ip_address | INET | Source IP (for logins) |

### Logged Events

Sensitive operations logged to audit trail:

1. **User Logins**: User ID, timestamp, IP address, success/failure.
2. **Student Data Access**: Who accessed student records, when, which records.
3. **Report Submissions**: Teacher ID, session ID, submission time.
4. **Payment Updates**: Finance role updating payment status (old status → new status).
5. **User Role Changes**: Admin changing user role (old role → new role).
6. **Subscription Changes**: Operations changing subscription (old status → new status).
7. **Schedule Changes**: Cancellations, rescheduling, deletions.
8. **Request Approvals**: Operations approving/rejecting leave or makeup requests.

### Access Control for Logs

- Audit logs visible to Admin and Operations roles only.
- Finance and Teacher roles cannot access audit logs.
- Parents cannot access audit logs.
- Logs archived (not deleted) after 1 year of inactivity.

## 13. Development Phases

### Phase 1: Audit & Foundation (Weeks 1-2)

- Inspect current website and project structure.
- Create TECHNICAL_AUDIT.md (completed).
- Design database schema (finalized, RLS policies drafted).
- Set up repository, branch, environment configuration.
- Deploy minimal Next.js application to Vercel.
- Set up Supabase project, PostgreSQL database.
- Create base authentication (login/logout, JWT tokens).

### Phase 2: Internal Admin Operations (Weeks 3-5)

- Admin dashboard (user management, KPIs).
- Student and teacher management.
- Lead qualification and enrollment workflow.
- Basic schedule creation.
- Subscription and payment tracking (read-only).
- Initial seed data (fictional only).

### Phase 3: Teacher Portal (Weeks 6-8)

- Teacher dashboard (today's sessions, weekly schedule).
- Student roster (assigned students only).
- Session attendance marking.
- Session report submission.
- Leave and makeup request workflow.
- Teacher profile and availability management.

### Phase 4: Parent Portal (Weeks 9-11)

- Parent dashboard (child selection, next session, latest report).
- Session schedule view.
- Session reports (filtered for parent visibility).
- Subscription and payment status.
- Leave/makeup/schedule-change request submission.
- Parent account settings.

### Phase 5: Public Registration & Website Integration (Weeks 12-13)

- Public registration form (lead capture).
- Spam prevention and rate limiting.
- Website integration (entry points to platform).
- Subdomain configuration (app.ratel-quran.com).

### Phase 6: Testing & Refinement (Weeks 14-15)

- Permission and data isolation testing.
- Mobile and RTL testing.
- User acceptance testing (UAT) with pilot operations/teacher/parent.
- Bug fixes and performance optimization.
- Documentation completion.

### Phase 7: Pilot Launch & Handover (Weeks 16-17)

- Parallel-run with pilot data (seed data + 5-10 real families, if approved).
- Observation and bug fixes.
- Gradual data transition (if approved).
- Documentation handover to operations team.
- Post-launch support and monitoring.

## 14. Non-Goals for Phase 1

The following are explicitly out of scope for the initial launch:

- **Video Calls or Webinars**: All sessions are scheduled; video conferencing is out-of-scope (teachers use external tools like Zoom/Meet).
- **Chat Messaging**: Internal messaging system not built; communication via email/WhatsApp only.
- **Mobile App**: Web-based platform only (mobile-responsive, not native app).
- **AI Grading**: Automatic Quran recitation grading via AI is out-of-scope.
- **Gamification**: Leaderboards, badges, or competition not implemented initially.
- **Full Accounting System**: Payment accounting (invoicing, tax calculation) not included; Fawaterk handles processor fees.
- **Multi-Language UI**: Arabic RTL only (English translations future work).
- **Inventory or Supply Chain**: Not applicable; only applies to course/resource management (future).
- **Real-Time Notifications**: Email and webhook-based notifications only; no push notifications or live feed initially.
- **Advanced Analytics**: Operational dashboard shows only essential KPIs (student count, growth rate, payment status, at-risk flags).

## 15. Open Questions

The following questions remain to be resolved before final implementation:

1. **DNS Configuration**: How will the app.ratel-quran.com subdomain be configured? Will it be via CNAME to Vercel, or a separate hosting arrangement? Point of contact: Operations/IT.

2. **Supabase Project Details**: What is the Supabase project name and region? Are there any existing policies or backups configured? Point of contact: Supabase account owner.

3. **Email Service Selection**: Which email service will be used for transactional emails (SendGrid, Resend, AWS SES)? What is the approval process for email template changes? Point of contact: Tech lead/Operations.

4. **Payment Webhook Configuration**: How will Fawaterk webhook notifications be authenticated and routed to the platform? Is there a test environment? Point of contact: Finance/Fawaterk integration owner.

5. **Data Migration Timing**: When will the first batch of real student data be migrated to the platform? What is the validation criteria for deeming the platform ready (bugs fixed, UAT passed, SLA agreement signed)? Point of contact: Operations lead.

6. **Backup and Disaster Recovery**: What is the RTO/RPO for database backups? Is there a disaster recovery plan or failover procedure documented? Point of contact: Infrastructure team.

7. **Monitoring and Alerts**: What monitoring tools will be used for application performance and uptime? Who is on-call for platform issues? Point of contact: DevOps/SRE.

8. **Future Scaling**: At what student count (10, 25, 50, 100) should the platform architecture be reviewed for scaling? What is the scaling strategy (horizontal, vertical, caching)? Point of contact: Operations/Tech lead.

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Owner**: Rattel Operations & Product  
**Status**: Draft (awaiting approval)
