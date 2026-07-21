# TECHNICAL_AUDIT.md - Rattel Operational Platform

**Date**: 21 July 2026  
**Repository**: rattelquran476-prog/rattl-report-generator  
**Audit Scope**: Phase 1 – Inspection Only. No implementation, no code changes, no new files beyond this audit.

---

## 1. Executive Summary

Rattel (رتّل) is a child-safe Arabic RTL Quran education platform. The **public marketing website** (`https://ratel-quran.com`) is live and operational. The **operational SaaS platform** (management, scheduling, reporting, payments) does not yet exist and must be built.

This repository is newly created and ready for the operational platform code. The current public website must remain untouched to preserve existing URLs, content, SEO, and user experience.

**Audit Conclusion**: A fresh Next.js + PostgreSQL operational platform at `https://app.ratel-quran.com` (or `/portal` route on same domain) is the lowest-risk approach. The marketing website and operational platform can coexist cleanly with minimal integration.

---

## 2. Repository Technology

### Current State

- **Repository**: `https://github.com/rattelquran476-prog/rattl-report-generator`
- **Contents**: Only `AGENTS.md` (specifications document)
- **No existing code, database, or deployment configuration**
- **Status**: Blank slate ready for development

### Identified Tech Stack Required

Based on the website inspection, the existing setup includes:

- **Session Platform**: Zoom (external, no replacement needed)
- **Payment Gateway**: Fawaterk (external, established integration)
- **Communication**: WhatsApp, Email
- **Hosting**: Current website appears to be hosted on a static or JAMstack platform

---

## 3. Current Website Inspection

### Website URL
`https://ratel-quran.com`

### Technology Stack (Observed)

- **Frontend**: HTML, CSS, JavaScript (likely Vue.js or React based on dynamic behavior)
- **Architecture**: Single-page application (SPA) or static site with client-side routing
- **RTL Support**: Full Arabic RTL layout implemented correctly
- **Design System**: Custom CSS with Rattel brand colors (deep teal, gold, cream palette)
- **Performance**: Fast load times, optimized assets

### Current Pages and Routes

| Route | Content | Status |
|-------|---------|--------|
| `/` | Homepage with features, pricing, testimonials | ✅ Live |
| `/#about` | About section | ✅ Live |
| `/#courses` | Three courses: Quran, Tajweed, Arabic | ✅ Live |
| `/#pricing` | Four subscription packages (1-4 sessions/week) | ✅ Live |
| `/#testimonials` | Parent testimonials with video links | ✅ Live |
| `/#faq` | FAQ section (collapsed) | ✅ Live |
| `/ramadan` | Ramadan-specific offer page | ✅ Live |
| `/contact` | Contact form/page | ✅ Live |
| `/auth` | Login page (mentioned in nav) | 🔗 Exists |
| `/payment` | Payment page (mentioned in nav) | 🔗 Exists |
| `/checkout/{package}` | Checkout for packages (S, A, B, C) | ✅ Integrated with Fawaterk |
| `/quran`, `/tajweed`, `/arabic` | Course detail pages | ✅ Live |

### Current Registration/Lead Capture

- No visible public registration form on homepage
- Lead capture via WhatsApp button (`+90 538 431 6635`)
- CTA: "احجزي حصة تجريبية مجانية" (Book a free trial session)
- WhatsApp link pre-fills a message requesting a trial session
- **No backend form or database storing registrations**
- **No automated lead tracking or qualification**

### Navigation Structure (Arabic RTL)

```
الرئيسية (Home)
عن الأكاديمية (About)
دوراتنا التعليمية (Our Courses)
الخطط (Plans/Pricing)
آراء الطلاب (Student Reviews)
الأسئلة الشائعة (FAQ)
رمضان 🌙 (Ramadan)
إتصل بنا (Contact Us)
[English toggle]
[WhatsApp: +90 538 431 6635]
[Login: دخول]
[Payment: الدفع]
[Trial Session: حصة تجريبية]
```

### Existing Brand Assets

- **Logo**: Rattel logo (SVG or high-res image at `/assets/ratel-logo-D7SGFeDV.png`)
- **Brand Colors**: 
  - Deep Teal: `#008F89`
  - Gold: `#D99A00`
  - Soft Cream: `#FDF8EF`
  - Soft Teal: `#70D1B2`
  - Mint Cream: `#DFF3EC`
- **Fonts**: Likely Cairo or Tajawal (common Arabic fonts)
- **Design Language**: Calm, warm, spacious, uncluttered, mobile-first
- **Tone**: Educational, reassuring, no pressure

### Current External Integrations

| Service | Purpose | Status |
|---------|---------|--------|
| **Zoom** | Online session hosting | Integrated (links in emails/dashboard) |
| **Fawaterk** | Secure payment processing (SSL, multiple methods) | Integrated at `/app.fawaterk.com/ec/3036` |
| **WhatsApp** | Lead contact and communication | Active (+90 538 431 6635) |
| **Google Forms** (possible) | Registration or feedback (link in "Know More" CTA) | Possible integration |

---

## 4. Existing Assets and Reusable Parts

### What Can Be Reused

1. **Brand Identity**: Logo, colors, fonts, design language are well-defined and should be reused exactly.
2. **Domain Ownership**: `ratel-quran.com` is registered and secured. Subdomain `app.ratel-quran.com` can be created.
3. **External Integrations**: Zoom, Fawaterk, WhatsApp APIs already integrated or understood.
4. **Existing Customers**: Live student base (number not visible, but testimonials suggest active usage).
5. **Payment Infrastructure**: Fawaterk integration is proven; no need to rebuild.
6. **Course/Service Definitions**: Three clear service lines (Quran, Tajweed, Arabic) with defined pricing.
7. **Arabic Localization**: Website is already fully localized and RTL-ready; patterns can be reused.

### What Must Remain Untouched

1. **Public website homepage and all routes** (prevent SEO loss, user confusion)
2. **Logo, colors, typography** (brand continuity)
3. **Existing URLs** (do not redirect or remove without explicit reason)
4. **Fawaterk payment link** (do not change payment flow)
5. **WhatsApp number and contact methods**

---

## 5. Missing Capabilities

### Currently Absent (Needed for Operational Platform)

| Feature | Current State | Needed For |
|---------|---------------|-----------|
| **User Registration Form** | WhatsApp-only | Accept family registrations with structured data |
| **Family/Parent Accounts** | None | Store parent profiles, preferences, timezones |
| **Student Profiles** | None | Track student progress, levels, goals, assignments |
| **Teacher Accounts** | None | Manage teacher capacity, availability, specializations |
| **Scheduling System** | Manual (WhatsApp/email) | Automated session scheduling, conflict detection |
| **Session Attendance** | Manual | Track attendance, generate reports |
| **Session Reports** | Not visible | Parents receive weekly progress updates |
| **Request Management** | Manual (WhatsApp/email) | Formalized leave, makeup, schedule-change workflows |
| **Subscription Tracking** | Fawaterk only | Manage packages, renewals, status, billing history |
| **Admin Dashboard** | None | View operations metrics, manage users, monitor system |
| **Teacher Dashboard** | None | View students, sessions, submit reports, manage requests |
| **Parent Portal** | None | View child progress, schedule, reports, account |
| **Database** | None | Persistent storage for all operational data |
| **Authentication** | None | User login, session management, permission control |
| **Authorization** | None | Role-based access (admin, operations, finance, teacher, parent) |
| **Audit Logging** | None | Track user actions for compliance and debugging |

---

## 6. Technical Risks

### High-Risk Issues to Avoid

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Breaking public website** | Loss of existing customers, SEO damage | Keep public site at `/` entirely untouched. New app at separate subdomain or `/portal` route if architecture allows. |
| **Data loss** | Irreversible damage, loss of trust | Use automated backups, test migrations, never run destructive queries without rollback plan. |
| **Storing card data** | PCI-DSS violations, legal liability | Use only Fawaterk (external processor). Never store CVV, card numbers, or full PAN. |
| **Child data exposure** | Privacy breach, regulatory violation | Apply row-level security, enforce authorization server-side and DB-side, validate all inputs, log sensitive access. |
| **Teacher seeing unassigned students** | Privacy violation, trust loss | Implement strong authorization checks in code and database. Test permission boundaries. |
| **Unencrypted secrets** | Compromised credentials, production takeover | Store all secrets in environment variables only. Maintain `.env.example` with no real values. Never commit secrets. |
| **No rollback plan** | Inability to recover from errors | Document all migrations, test locally, keep backups, practice rollback before production deploy. |
| **Deploying without approval** | Uncontrolled changes to live system | Require explicit human approval before any production deploy. Use CI/CD gates. |
| **Spam/abuse of registration form** | System abuse, abuse of email/WhatsApp | Implement rate limiting, CAPTCHA if needed, server-side validation, duplicate detection. |

### Security & Privacy Constraints

- Never store credit card numbers, CVV, or sensitive payment-card data
- Do not store real personal data in seeds, tests, screenshots, or fixtures
- Do not send child data to AI services without explicit consent
- Validate all inputs on the server, never trust frontend validation
- Enforce authorization server-side and, where supported, database-side (row-level security)
- Log sensitive events (failed logins, permission checks, data access)
- Handle errors safely without leaking system internals

---

## 7. Recommended Integration Strategy

### Option 1: Separate Subdomain (Recommended) ✅

**Setup**: Operational platform at `https://app.ratel-quran.com`

**Pros**:
- Cleanest separation of concerns (marketing vs. operations)
- No risk of interfering with public website routes
- Easier to version and deploy independently
- Standard practice for SaaS applications
- Subdomains are SEO-neutral for public site

**Cons**:
- Requires DNS configuration
- Users must navigate to a different domain

**Implementation**: 
- Keep `https://ratel-quran.com` as-is for marketing
- Add `app` subdomain pointing to operational platform
- Public site can link to app with: "دخول الأسرة" → `https://app.ratel-quran.com/login`

---

### Option 2: Route-Based Integration (Alternative)

**Setup**: Operational platform at `https://ratel-quran.com/portal`

**Pros**:
- Single domain, simpler for some users
- No DNS changes needed

**Cons**:
- Requires careful routing to avoid conflicts
- Higher risk of accidental interference with public site
- Must ensure `/portal/*` routes never conflict with existing routes
- More complex deployment configuration

**Decision**: **Option 1 (app.ratel-quran.com) is safer and recommended** unless the current website framework makes subdomain routing difficult.

---

### Website Integration Points

#### Navigation Updates (Minimal, Non-Breaking)

Public website should add links to operational platform:

```
Main Nav:
  - Existing: الرئيسية، عن الأكاديمية، دوراتنا، الخطط، ...
  + New: سجّلي طفلك → https://app.ratel-quran.com/register
  + New: دخول الأسرة → https://app.ratel-quran.com/login
  + New (Footer): دخول المعلم → https://app.ratel-quran.com/teacher/login
  + New (Footer): دخول الإدارة → https://app.ratel-quran.com/admin/login
```

#### Existing Routes Preserved

- All current routes remain unchanged
- Checkout flow continues to use Fawaterk
- WhatsApp number and contact methods unchanged
- SEO URLs and structure intact

---

## 8. Lowest-Risk Implementation Plan

### Phase 1: Foundation (Weeks 1-2)

**Deliverables**:
- Database schema (PostgreSQL)
- Authentication system with JWT
- Base role-based authorization (Admin, Operations, Finance, Teacher, Parent)
- RTL-aware base layout and design system
- Deployment configuration (Vercel, Railway, or similar)

**Goals**:
- Secure foundation for all future features
- Prove authorization works (prevent unauth access)
- Establish CI/CD pipeline

**Risk Level**: 🟢 Low (isolated work, no data yet)

---

### Phase 2: Registration & Lead Management (Weeks 3-4)

**Deliverables**:
- Public registration form (no login required)
- Lead database with stages (New → Contacted → Qualified → ... → Enrolled)
- Admin lead dashboard
- Email/WhatsApp notifications

**Goals**:
- Capture structured registration data
- Move from manual WhatsApp tracking to automated system

**Risk Level**: 🟢 Low (form only, no business-critical data)

---

### Phase 3: Student & Teacher Management (Weeks 5-6)

**Deliverables**:
- Student profiles (linked to parents, single parent → multiple children)
- Teacher profiles (capacity, availability, specializations)
- Admin dashboard for managing both
- Automated calculations (available seats, utilization rate)

**Goals**:
- Build core data model
- Establish parent-student-teacher relationships
- Ready for scheduling

**Risk Level**: 🟡 Medium (business data, but non-critical)

---

### Phase 4: Scheduling (Weeks 7-8)

**Deliverables**:
- Schedule creation (recurring weekly sessions)
- Conflict detection (prevent teacher double-booking)
- Session auto-generation
- Calendar view (teacher & parent)

**Goals**:
- Replace manual scheduling with automated system
- Prevent double-bookings
- Show schedule in correct timezone

**Risk Level**: 🟡 Medium (critical for daily operations)

---

### Phase 5: Session Reports & Teacher Dashboard (Weeks 9-10)

**Deliverables**:
- Session report form (quick 2-minute template)
- Teacher dashboard (today's sessions, students, reports, requests)
- Report visibility (parent sees report, but not admin notes)
- Attendance tracking

**Goals**:
- Enable teachers to submit reports quickly
- Give parents visibility into progress
- Reduce manual follow-up

**Risk Level**: 🟡 Medium (depends on phase 4)

---

### Phase 6: Requests & Leave Management (Weeks 11-12)

**Deliverables**:
- Unified requests table (leave, makeup, schedule change, etc.)
- Request workflow (New → Under Review → Approved/Rejected → Completed)
- Parent & teacher request submission
- Admin approval interface
- Automatic makeup session scheduling

**Goals**:
- Formalize informal requests
- Reduce WhatsApp clutter
- Automate makeup session creation

**Risk Level**: 🟡 Medium (workflow-dependent)

---

### Phase 7: Subscriptions & Payments (Weeks 13-14)

**Deliverables**:
- Subscription model (linked to student, tracking packages, renewal dates)
- Payment tracking (status: Upcoming, Due, Paid, Overdue, etc.)
- Payment dashboard (finance user)
- External payment link generation
- Invoice/receipt storage

**Goals**:
- Track subscription lifecycle
- Enable finance team to monitor cash flow
- Do not store card data (use Fawaterk links only)

**Risk Level**: 🟡 Medium (financial data, low implementation complexity)

---

### Phase 8: Parent Portal (Weeks 15-16)

**Deliverables**:
- Parent login
- Child view / switch view
- Schedule (with timezone conversion)
- Latest reports
- Subscription status
- Request submission

**Goals**:
- Give parents self-service access
- Reduce support emails
- Build trust with transparency

**Risk Level**: 🟢 Low (read-only mostly, depends on phases 3-5)

---

### Phase 9: Admin Dashboard & Metrics (Weeks 17-18)

**Deliverables**:
- Operational dashboard (active students, growth, utilization, at-risk students, etc.)
- Key metrics toward 50-student target
- Reports (late submissions, overdue payments, etc.)
- System health checks

**Goals**:
- Enable operations team to manage 50+ students
- Provide visibility into growth

**Risk Level**: 🟢 Low (read-only, depends on phases 2-7)

---

### Phase 10: Testing & Handover (Weeks 19-20)

**Deliverables**:
- Permission-based test suite
- Mobile & RTL layout tests
- Security audit
- Deployment runbook
- Rollback plan
- User guides (admin, teacher, parent, developer)

**Goals**:
- Ensure no privacy leaks
- Confirm mobile & RTL work
- Document deployment and rollback

**Risk Level**: 🟡 Medium (final safety gate)

---

## 9. Proposed Future File Structure

```
rattl-report-generator/
├── .github/
│   ├── workflows/
│   │   ├── tests.yml
│   │   ├── lint.yml
│   │   └── deploy.yml
│   └── ISSUE_TEMPLATE/
├── .env.example                    # Example secrets (no real values)
├── .gitignore
├── README.md                       # Setup and development guide
├── package.json
├── tsconfig.json
├── next.config.js (or similar)
│
├── src/
│   ├── app/                        # Next.js app directory (or pages/)
│   │   ├── (auth)/                 # Public auth routes
│   │   │   ├── register/
│   │   │   ├── login/
│   │   │   └── layout.tsx
│   │   ├── (parent)/               # Parent portal
│   │   │   ├── dashboard/
│   │   │   ├── children/
│   │   │   ├── schedule/
│   │   │   ├── reports/
│   │   │   └── layout.tsx (RTL)
│   │   ├── (teacher)/              # Teacher portal
│   │   │   ├── dashboard/
│   │   │   ├── students/
│   │   │   ├── reports/
│   │   │   └── layout.tsx (RTL)
│   │   ├── (admin)/                # Admin/operations portals
│   │   │   ├── dashboard/
│   │   │   ├── leads/
│   │   │   ├── students/
│   │   │   ├── teachers/
│   │   │   ├── schedules/
│   │   │   ├── reports/
│   │   │   ├── subscriptions/
│   │   │   ├── requests/
│   │   │   └── layout.tsx (RTL)
│   │   └── api/                    # API routes
│   │       ├── auth/
│   │       ├── parents/
│   │       ├── students/
│   │       ├── teachers/
│   │       ├── schedules/
│   │       ├── sessions/
│   │       ├── reports/
│   │       ├── requests/
│   │       ├── subscriptions/
│   │       └── payments/
│   ├── lib/
│   │   ├── auth.ts                 # JWT, session management
│   │   ├── db.ts                   # Database connection
│   │   ├── schemas.ts              # Zod/Prisma validation
│   │   ├── permissions.ts          # Authorization checks
│   │   ├── timezone.ts             # Timezone utilities
│   │   ├── arabic.ts               # RTL helpers
│   │   └── constants.ts            # App constants (colors, strings, etc.)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── forms/
│   │   │   ├── RegistrationForm.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── ReportForm.tsx
│   │   │   └── RequestForm.tsx
│   │   ├── cards/
│   │   └── tables/
│   ├── styles/
│   │   ├── globals.css
│   │   ├── rattel-brand.css        # RTL, colors, typography
│   │   └── tailwind.config.ts      # RTL Tailwind config
│   └── middleware.ts               # Auth, locale, authorization
│
├── db/
│   ├── schema.prisma (or migrations/ for raw SQL)
│   ├── seed.ts                     # Fictional test data only
│   └── migrations/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── permissions.test.ts         # Core authorization tests
│
├── docs/
│   ├── TECHNICAL_AUDIT.md          # This file
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── PERMISSIONS.md
│   ├── DEPLOYMENT.md
│   ├── TESTING.md
│   ├── ADMIN_GUIDE_AR.md
│   ├── TEACHER_GUIDE_AR.md
│   └── PARENT_GUIDE_AR.md
│
├── AGENTS.md                       # Specifications (existing)
├── package-lock.json (or pnpm-lock.yaml)
└── ...
```

---

## 10. Questions Before Implementation

### Critical Questions (Block Implementation if Unanswered)

1. **Subdomain vs. Route**: Is `app.ratel-quran.com` approved and can it be set up in DNS? Or should the platform run at `/portal` on the same domain?

2. **Database**: Should we use PostgreSQL (recommended), or does the team prefer Supabase, MongoDB, or another database?

3. **Hosting**: Where should the operational platform be hosted? (Vercel, Railway, AWS, self-hosted, etc.)

4. **Authentication**: Should we use JWT + database, OAuth (Google/Apple), or integrate with an existing identity provider?

5. **Current User Count**: How many students and teachers are currently active? This affects capacity planning and data migration strategy.

6. **Existing Data**: Is there any student, teacher, or payment data currently stored anywhere (Fawaterk, spreadsheet, manual records) that must be migrated?

7. **Teacher Availability**: Can a teacher be assigned to multiple students? (Assumed yes, but confirm.)

8. **Timezone**: Should the system support multiple timezones per user, or assume each user selects one primary timezone?

9. **Payment History**: Should we migrate existing payments from Fawaterk into the system, or start fresh from deployment date?

10. **Go-Live Date**: What is the target date to move from manual WhatsApp/email management to the automated platform? This affects phasing.

### Non-Blocking, Nice-to-Know Questions

- Should teachers be able to reschedule sessions themselves, or only admins?
- Should the system support bulk operations (e.g., export reports, bulk messaging)?
- Are there any current integrations (Slack, email providers, etc.) that must be maintained?
- Should the parent portal support multiple languages, or Arabic and English only?

---

## Summary: Next Steps

### Immediate Actions (Today)

1. ✅ Review this `TECHNICAL_AUDIT.md`
2. ❓ Answer the 10 critical questions above
3. ⏸️ **PAUSE** — Await owner approval before implementing

### Upon Approval (Next Sprint)

1. Create `ARCHITECTURE.md` with technology choices and system design
2. Create `DATABASE_SCHEMA.md` with full ER diagram and table definitions
3. Set up development environment (Node.js, database, secrets)
4. Begin Phase 1: Foundation (database, auth, authorization)

### What Will NOT Happen Until Approved

- No code commits beyond this audit
- No new npm packages installed
- No public website changes
- No database created
- No API endpoints built
- No UI components written

---

## Appendix: Rattel Brand Guidelines (Extracted from Website)

### Official Colors

```css
--rattel-deep-teal: #008F89;
--rattel-gold: #D99A00;
--rattel-soft-cream: #FDF8EF;
--rattel-soft-teal: #70D1B2;
--rattel-mint-cream: #DFF3EC;
```

### Typography

- Preferred fonts: Cairo, Tajawal, IBM Plex Sans Arabic
- Direction: RTL (Arabic)
- Body text: Warm, calm, educational tone

### Tone & Values

- هادئة (Calm)
- دافئة (Warm)
- مطمئنة (Reassuring)
- تربوية (Educational)
- مباشرة دون ضغط (Direct, no pressure)

### Avoid

- Loud red, bright blue, purple, neon colors
- Heavy shadows, excessive gradients
- Crowded cards, too many icons
- Commercial pressure language
- Strong Islamic ornamentation

### Approved Messaging Examples

- "نغرس حب القرآن... ليحفظ الطفل هويته أينما كان" (We plant love of Quran to preserve the child's identity wherever they are)
- "لا نضغط، لا نقارن، لا نحرج" (We don't pressure, compare, or shame)
- "نبدأ من احتياج طفلك لا من مسار جاهز" (We start from the child's needs, not a ready-made path)

---

## Document Status

**Created**: 21 July 2026  
**Phase**: 1 – Audit (Inspection Only)  
**Status**: 🔴 **AWAITING OWNER APPROVAL** — No implementation may proceed until questions are answered and this audit is approved.  
**Next Review**: Upon approval; then transition to ARCHITECTURE.md

---

*This audit document is the sole deliverable for Phase 1. No code changes, database creation, or additional files have been made. The repository remains ready for development upon explicit approval.*
