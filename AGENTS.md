# AGENTS.md

## Project: Rattel Quran Operational Platform

This repository supports the operational system for **Rattel / رتّل**, a child-safe Arabic RTL Quran education platform for families, teachers, operations, and finance.

Rattel currently has a live marketing website at:

- `https://ratel-quran.com/`

The goal is to extend the existing Rattel ecosystem with an operational SaaS platform. Do **not** rebuild the public marketing website unless a concrete technical issue proves that a limited change is necessary.

## Product Context

Rattel is a Quran education platform for children aged 4 to 14, especially Muslim families living outside Arabic-speaking countries. The product promise is calm, safe, individual Quran learning that preserves the child’s relationship with Quran, Arabic, and identity.

Core values to preserve in every UI and workflow:

- Mercy and gentleness.
- Educational safety.
- No pressure, no comparison, no shame.
- Individual learning by child level.
- Clear parent reassurance.
- Arabic RTL-first experience.
- Operational simplicity for a team growing from 20 active students to 50 active students.

## Primary Objective

Build the full operational platform for Rattel with:

1. Family registration form.
2. Parent portal.
3. Teacher dashboard.
4. Internal admin dashboard.
5. Student and teacher management.
6. Scheduling and Quran sessions.
7. Session reports.
8. Leave, makeup, and schedule-change requests.
9. Subscription and payment tracking.
10. Simple operational metrics for managing up to 50 active students, with room to scale later.

## Absolute Constraints

- Do not rebuild the public marketing site from scratch.
- Preserve existing URLs, pages, content, and SEO unless a specific integration issue requires a minimal change.
- Do not change the Rattel logo, redraw it, recolor it, stretch it, or alter proportions.
- Do not add out-of-scope products such as internal chat, video calls, a mobile app, gamification, full accounting, or AI-based recitation grading.
- Do not store credit card numbers, CVV, or sensitive payment-card data.
- Do not commit secrets, API keys, passwords, production data, or private child data.
- Do not deploy to production without explicit human approval.
- Do not run destructive migrations or delete real data without backup and rollback.
- Do not use real personal data in seeds, tests, screenshots, examples, or fixtures.

## First Required Step: Technical Audit

Before writing feature code, inspect the repository and current website integration points.

Create `TECHNICAL_AUDIT.md` before implementation. It must include:

- Current technology stack: WordPress, React, Next.js, Laravel, PHP, Webflow, static HTML, or other.
- Existing project structure.
- Visible hosting/deployment clues.
- Existing database or storage, if any.
- Existing login/auth system, if any.
- Existing registration form and where its data goes.
- Current pages and routes.
- Available integration points.
- Arabic and RTL support status.
- Current security or technical risks.
- Reusable parts.
- Parts needing development.
- Recommended least-risk plan.
- Expected files to create or modify.
- Missing information that blocks safe implementation.

Do not start rewriting the project before this audit is complete.

## Integration Strategy

Use the least invasive integration strategy.

Preferred target, when technically suitable:

- Keep the public site at `https://ratel-quran.com/`.
- Build the operational app at `https://app.ratel-quran.com/`.

Alternative:

- Use a route such as `https://ratel-quran.com/portal` only if the existing site architecture supports this without conflict or SEO risk.

Before implementation, explain why the chosen option is safer. The operational system must stay visually and functionally connected to Rattel’s identity.

Website integration should add:

- Main navigation: `سجّلي طفلك`
- Main navigation: `دخول الأسرة`
- Footer or suitable area: `دخول المعلم`

Suggested routes, adapted to the chosen architecture:

- `/register`
- `/login`
- `/parent`
- `/teacher`
- `/admin`

## Users and Authorization

Implement authorization on the server and database layer, not only by hiding UI elements.

Roles:

1. `Admin`
2. `Operations`
3. `Finance`
4. `Teacher`
5. `Parent`

### Admin

- Full access.
- Manage users.
- Manage students and teachers.
- Manage schedules and sessions.
- Manage subscriptions and payments.
- Review reports and requests.
- View operational dashboard.

### Operations

- Manage registration leads.
- Manage students.
- Manage teachers.
- Assign placements and schedules.
- Follow sessions.
- Review reports.
- Manage leave and makeup requests.

### Finance

- View subscriptions and payments.
- Update payment status.
- Add payment links and receipts.
- Avoid access to sensitive educational notes unless necessary.

### Teacher

- View only assigned students.
- View only own sessions.
- Record attendance.
- Submit session reports.
- Submit leave or makeup requests.
- Never see fees or students assigned to other teachers.

### Parent

- View only own children.
- View schedule.
- View child reports.
- View subscription and payment status.
- Submit leave, makeup, or schedule-change requests.
- Never see data belonging to another family.

## Core Modules

### 1. Family Registration

Public form accessible without login.

Fields:

- Parent name.
- WhatsApp number.
- Email.
- Country.
- Time zone.
- Child name.
- Child age.
- Child gender.
- Reading level.
- Current memorization amount.
- Requested service.
- Suitable days.
- Suitable times.
- How the family heard about Rattel.
- Additional notes.
- Privacy policy consent.

Services:

- تحفيظ القرآن الكريم
- تصحيح التلاوة
- المراجعة والتثبيت
- تعليم القراءة القرآنية للمبتدئين
- متابعة فردية حسب مستوى الطفل

Lead stages:

1. `New`
2. `Contacted`
3. `Qualified`
4. `Assessment Scheduled`
5. `Assessed`
6. `Plan Proposed`
7. `Awaiting Payment`
8. `Enrolled`
9. `No Response`
10. `Lost`

After submission:

- Validate on the server.
- Save lead to the database.
- Prevent duplicate/spam submissions with rate limiting and reasonable dedupe.
- Notify admins/operations.
- Show this Arabic success message:

```text
شكرًا لتواصلك مع رتّل. وصلتنا بيانات طفلك، وسيتواصل معك الفريق لاختيار البداية الأنسب له بإذن الله.
```

Do not create a parent account before acceptance unless there is a clear technical benefit and it is documented.

### 2. Parents and Students

Support multiple children per parent.

Parent profile:

- Name.
- Email.
- Phone.
- WhatsApp.
- Country.
- Time zone.
- Preferred language.
- Account status.
- Created date.

Student profile:

- Name.
- Parent.
- Age.
- Gender.
- Country and time zone.
- Reading level.
- Memorization level.
- Service/path.
- Student status.
- Assigned teacher.
- Start date.
- Weekly session count.
- Session duration.
- Current goal.
- Risk level.
- Internal admin notes.
- Last follow-up date.

Student statuses:

- `Pending Placement`
- `Active`
- `Paused`
- `At Risk`
- `Withdrawn`
- `Completed`

Do not expose internal admin notes to parents or teachers.

### 3. Teachers and Capacity

Teacher profile:

- Name.
- Email.
- Phone.
- Gender.
- Country.
- Time zone.
- Specializations.
- Suitable age groups.
- Teacher status.
- Maximum students.
- Current active students.
- Available seats.
- Weekly available hours.
- Availability slots.
- Admin rating.
- Internal notes.

Automatically calculate:

```text
available_seats = max_students - active_students
utilization_rate = active_students / max_students
```

Show alerts when:

- Utilization is 80% or higher.
- No seats are available.
- Reports are late.
- Upcoming teacher leave affects students.

### 4. Schedules and Sessions

Build a simple scheduler suitable for 50 active students.

Current version supports:

- Recurring weekly appointments.
- One student with one teacher.
- Day.
- Start time.
- End time.
- Time zone.
- Meeting link.
- Schedule start date.
- Optional end date.
- Schedule status.
- Pause.
- Rescheduling.

Session statuses:

- `Scheduled`
- `Completed`
- `Student Absent`
- `Teacher Absent`
- `Cancelled`
- `Rescheduled`
- `Makeup Required`
- `Makeup Completed`

Requirements:

- Prevent teacher schedule conflicts.
- Display times in the viewer’s time zone.
- Generate upcoming sessions automatically or through a documented reliable mechanism.

### 5. Session Reports

Teachers must be able to submit a report in under two minutes.

Fields:

- Student.
- Teacher.
- Session.
- Date.
- Attendance status.
- Reviewed material.
- New lesson or memorization.
- Performance level.
- Engagement level.
- Homework.
- Note to parent.
- Internal admin note.
- Needs admin intervention?
- Intervention reason.

Performance levels:

- `Excellent`
- `Good`
- `Needs Follow-up`

Engagement levels:

- `Excellent`
- `Good`
- `Low`

After save:

- Report is visible to the correct parent, excluding internal admin note.
- Related session status updates when appropriate.
- Admin alert appears if intervention is requested.
- Created and updated timestamps are recorded.
- Teacher cannot edit after the admin-configured edit window unless specially authorized.

### 6. Parent Portal

Arabic RTL, mobile-first.

Navigation:

- الرئيسية
- أطفالي
- الجدول
- التقارير
- الاشتراك
- الطلبات
- الحساب

Home page shows:

- Selected child.
- Teacher.
- Path/service.
- Next session.
- Latest report.
- Current homework.
- Subscription status.
- Open request, if any.

If a parent has multiple children, add a clear child switcher.

Avoid complex administrative tables.

### 7. Teacher Dashboard

Navigation:

- الرئيسية
- حلقات اليوم
- الجدول الأسبوعي
- طلابي
- التقارير
- الطلبات
- الحساب

Home page shows:

- Today’s sessions.
- Next session.
- Missing reports.
- Open requests.
- Sessions completed this month.
- Students needing follow-up.

Teacher can see only assigned students and own sessions.

### 8. Requests

Use one unified requests table.

Request types:

- `Parent Leave`
- `Teacher Leave`
- `Makeup Session`
- `Schedule Change`
- `Pause Subscription`
- `Resume Subscription`
- `Change Session Count`
- `Complaint`
- `General Inquiry`

Fields:

- Requester.
- Requester role.
- Student.
- Teacher.
- Related session.
- Type.
- Reason.
- Requested date.
- Suggested alternative time.
- Status.
- Admin notes.
- Created date.
- Closed date.

Statuses:

- `New`
- `Under Review`
- `Approved`
- `Rejected`
- `Scheduled`
- `Completed`
- `Cancelled`

Show rejection or modification reasons clearly and respectfully.

### 9. Subscriptions and Payments

Build lightweight tracking, not a full accounting system.

Subscription:

- Student.
- Package.
- Price.
- Currency.
- Number of sessions.
- Start date.
- Renewal date.
- Subscription status.
- Discount, if any.
- Notes.

Payment:

- Subscription.
- Amount.
- Currency.
- Due date.
- Paid date.
- Status.
- Payment method.
- External payment link.
- Reference number.
- Receipt link.

Payment statuses:

- `Upcoming`
- `Due`
- `Paid`
- `Overdue`
- `Waived`
- `Refunded`
- `Cancelled`

Use external payment links or a replaceable payment-provider integration. Never store card data or CVV.

### 10. Admin Dashboard

Use practical cards, numbers, and tables. Avoid unnecessary charts.

Show:

- Active students.
- Target: 50.
- Progress toward target.
- New students this month.
- Paused/withdrawn students this month.
- Net student growth.
- New registration leads.
- Students waiting for assessment.
- Students waiting for payment.
- At-risk students.
- Available teacher seats.
- Teachers over 80% utilization.
- Sessions scheduled this week.
- Completed sessions.
- Late session reports.
- Due payments.
- Overdue payments.
- Requests needing action.

## Database Guidance

Reuse the existing database if it is suitable. If no suitable database exists, use PostgreSQL or Supabase/Postgres, but do not force Supabase when the current stack already provides a safer backend path.

Logical tables:

- `profiles`
- `parents`
- `students`
- `teachers`
- `leads`
- `assessments`
- `enrollments`
- `teacher_availability`
- `schedules`
- `sessions`
- `session_reports`
- `subscriptions`
- `payments`
- `requests`
- `notifications`
- `audit_logs`

Use relationships, foreign keys, indexes, and constraints. Use UUIDs where appropriate.

Add these fields to sensitive or operational tables when useful:

- `created_at`
- `updated_at`
- `created_by`
- `updated_by`

## Privacy and Security

This system handles children’s data. Apply strong data minimization and access control.

Requirements:

- Collect the minimum necessary data.
- Validate all inputs on the server.
- Protect routes and APIs.
- Never trust frontend-only authorization.
- Use row-level security where supported.
- Log sensitive events.
- Do not manually store passwords.
- Do not store card data.
- Do not show a child to an unassigned teacher.
- Do not send child data to AI services without explicit consent.
- Handle errors safely without leaking system internals.
- Protect public forms with spam prevention and rate limiting.
- Store secrets only in environment variables.
- Add `.env.example` without real values.
- Never ask the user to paste real passwords or keys into chat or code.

## Brand and UI Rules

Design language:

- Arabic RTL.
- Calm, warm, educational, organized.
- Mobile-first.
- Spacious and uncluttered.
- Suitable for mothers and reassuring for children.

Official colors:

```css
--rattel-deep-teal: #008F89;
--rattel-gold: #D99A00;
--rattel-soft-cream: #FDF8EF;
--rattel-soft-teal: #70D1B2;
--rattel-mint-cream: #DFF3EC;
```

Use gold sparingly.

Preferred fonts, depending on project availability:

- `Cairo`
- `Tajawal`
- `IBM Plex Sans Arabic`

Do not use more than two fonts.

Avoid:

- Loud red.
- Heavy black.
- Bright blue.
- Purple.
- Neon colors.
- Strong shadows.
- Excessive gradients.
- Crowded cards.
- Too many icons.
- Heavy Islamic ornamentation.
- Commercial pressure language.

Approved tone:

- هادئة
- دافئة
- مطمئنة
- تربوية
- مباشرة دون ضغط

Use wording like:

- `نغرس حب القرآن... ليحفظ الطفل هويته أينما كان`
- `نبدأ من احتياج طفلك لا من مسار جاهز`
- `لا نضغط، لا نقارن، لا نحرج`
- `نعلم القرآن بالمحبة قبل التصحيح`
- `ابدئي رحلة طفلك مع القرآن بطمأنينة`

Avoid wording like:

- `احجزي الآن قبل فوات الأوان`
- `طفلك متأخر`
- `أسرع طريقة لحفظ القرآن`
- `نتائج مضمونة`
- `خصم لفترة محدودة`

## Development Workflow

Work in a branch named:

```bash
feature/rattel-portal
```

Use small, clear commits.

Before coding:

1. Inspect files.
2. Identify stack and package manager.
3. Read existing README, config files, routes, database/migration files, and deployment files.
4. Create/update `TECHNICAL_AUDIT.md`.
5. Present the least-risk implementation plan.

When modifying code:

- Prefer minimal, reversible changes.
- Keep business logic on the server where possible.
- Use typed validation schemas where supported.
- Keep authorization checks close to data access.
- Preserve existing public routes.
- Do not introduce new production dependencies without a documented reason.
- If adding dependencies, update the correct lockfile.

Package manager:

- Use the package manager already used by the repository.
- If no lockfile exists, prefer `pnpm` for new Node/TypeScript work unless the existing host requires another choice.

## Suggested Implementation Phases

### Phase 1: Audit

- Inspect project and website integration.
- Create `TECHNICAL_AUDIT.md`.
- Identify technology, risks, reusable parts, and least-risk plan.

### Phase 2: Foundation

- Database schema.
- Authentication.
- Authorization.
- Base layout.
- RTL design tokens.
- Environment configuration.
- Audit logs.

### Phase 3: Internal Operations

- Admin dashboard.
- Leads.
- Students.
- Parents.
- Teachers.
- Schedules.
- Subscriptions.
- Payments.

### Phase 4: Teacher Portal

- Teacher home.
- Today’s sessions.
- Weekly schedule.
- Students.
- Attendance.
- Session reports.
- Requests.

### Phase 5: Parent Portal

- Children.
- Schedule.
- Reports.
- Subscription.
- Requests.
- Account.

### Phase 6: Website Integration

- Registration and login links.
- Parent/teacher/admin entry points.
- Subdomain or route integration.
- SEO preservation checks.

### Phase 7: Testing and Handover

- Permission tests.
- Mobile tests.
- RTL tests.
- Security tests.
- Documentation.
- Deployment and rollback plan.

## Documentation Requirements

Create or update:

1. `TECHNICAL_AUDIT.md`
2. `ARCHITECTURE.md`
3. `DATABASE_SCHEMA.md`
4. `PERMISSIONS.md`
5. `DEPLOYMENT.md`
6. `TESTING.md`
7. `ADMIN_GUIDE_AR.md`
8. `TEACHER_GUIDE_AR.md`
9. `PARENT_GUIDE_AR.md`

`DEPLOYMENT.md` must include:

- Environment setup.
- Required environment variables.
- Local development commands.
- Database creation.
- Migration commands.
- Subdomain connection.
- Deployment steps.
- Rollback steps.

## Testing Requirements

Add tests appropriate to the stack. Cover at minimum:

1. Parent cannot see another family’s child.
2. Teacher cannot see an unassigned student.
3. Teacher cannot see payments.
4. Public registration form submission.
5. Converting accepted lead to student.
6. Creating a non-conflicting schedule.
7. Preventing teacher schedule conflict.
8. Recording attendance.
9. Creating a session report.
10. Showing report to the correct parent only.
11. Creating leave or makeup request.
12. Updating payment status.
13. Calculating available seats.
14. Calculating active students toward target 50.
15. RTL/mobile layout checks for portals.

Seed data may include only fictional data:

- One admin.
- One operations user.
- One finance user.
- Three teachers.
- Five parents.
- Seven students.
- Sample schedules, sessions, reports, subscriptions, and payments.

## Acceptance Criteria

The work is complete only when:

- Existing public website routes still work.
- A new family can submit registration.
- Admin/operations can convert a lead into a student.
- Admin/operations can assign teacher and schedule.
- Teacher sees only assigned students and sessions.
- Teacher can submit session reports.
- Parent sees only own children and reports.
- Parent can submit leave/makeup/schedule-change request.
- Finance can track due, paid, and overdue payments.
- Admin dashboard shows progress toward 50 active students.
- UI works in Arabic RTL on mobile.
- Authorization is enforced server-side and, where supported, database-side.
- No sensitive payment data is stored.
- `.env.example` exists with no real secrets.
- Documentation exists for setup, testing, deployment, and rollback.
- Production deployment requires explicit human approval.

## Expected First Response from Codex

Before writing code, respond in this order:

1. Summary of understanding.
2. Current technology audit findings.
3. What will be reused.
4. What will be added.
5. Proposed architecture.
6. Database outline.
7. Permissions model.
8. Files to create or modify.
9. Phased implementation plan.
10. Blocking risks/questions only.

Do not ask questions that can be answered from repository files.

## Useful Commands

Detect actual commands from the repository before using these examples.

```bash
# inspect
ls
find . -maxdepth 3 -type f | sort

# install, only after package manager is identified
pnpm install

# dev
pnpm dev

# quality checks
pnpm lint
pnpm test
pnpm typecheck

# production build, only when explicitly needed
pnpm build
```

If the repository is not Node-based, replace these commands with the project’s real toolchain and document them in `TECHNICAL_AUDIT.md`.

## Final Safety Reminder

Rattel serves children and families. Favor privacy, calm UX, low operational risk, reversible migrations, and minimal changes to the live public site.
