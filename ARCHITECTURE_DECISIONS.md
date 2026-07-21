# ARCHITECTURE_DECISIONS.md - Owner Approval Required

**Date**: 21 July 2026  
**Repository**: rattelquran476-prog/rattl-report-generator  
**Issue**: #3 Owner decisions before Phase 2 architecture  
**Status**: ⏳ Awaiting Owner Approval (No Implementation Started)

---

## Executive Summary

This document presents **recommended architectural decisions** for the Rattel operational platform. Each decision includes technical justification and owner approval points. Implementation will not begin until this document is approved.

---

## 1. Scope Integration Decision: `app.ratel-quran.com` (Subdomain)

### Recommended Decision ✅

**Deploy the operational platform at a separate subdomain**: `https://app.ratel-quran.com`

**Keep the public marketing website** at `https://ratel-quran.com` entirely untouched.

### Technical Justification

| Aspect | Details |
|--------|---------|
| **Risk Level** | 🟢 Lowest |
| **SEO Impact** | None (subdomains are SEO-neutral for marketing site) |
| **Deployment Independence** | Maximum (marketing and operational versioning separate) |
| **Conflict Risk** | Zero (no route overlap possible) |
| **User Experience** | Clear mental model (marketing ≠ operations) |
| **Industry Standard** | 100% standard for SaaS platforms (e.g., `app.notion.com`, `app.slack.com`) |

### Why NOT `/portal` Route Alternative

The technical audit identified that the public website is a single-page application (SPA) or static JAMstack site with client-side routing. Using a `/portal` route creates risks:

1. **Route Conflict**: If the marketing site uses catch-all routing, `/portal/*` might conflict with existing 404 handlers
2. **Deployment Coupling**: Marketing and operational deployments would share the same server/edge
3. **Version Management**: Harder to maintain separate feature branches and releases
4. **Rollback Complexity**: Issue in operations platform could require rolling back entire domain

### Implementation Plan

**DNS Changes**:
```
app.ratel-quran.com  CNAME  app-platform.your-hosting-provider.com
```

**Public Website Integration**:
Add minimal navigation links to the public site:
```html
<!-- Main Navigation -->
<a href="https://app.ratel-quran.com/register">سجّلي طفلك</a>
<a href="https://app.ratel-quran.com/login">دخول الأسرة</a>

<!-- Footer -->
<a href="https://app.ratel-quran.com/teacher/login">دخول المعلم</a>
<a href="https://app.ratel-quran.com/admin/login">دخول الإدارة</a>
```

**Owner Approval Points**:
- [ ] Does the team own or control the DNS for `ratel-quran.com`?
- [ ] Is a separate subdomain acceptable for the operational platform?
- [ ] Can the public website be updated to include links to the new platform?

---

## 2. Database Decision: PostgreSQL

### Recommended Decision ✅

**Use PostgreSQL** as the primary relational database.

**Option**: Managed PostgreSQL (Supabase, Railway, AWS RDS, Render) rather than self-hosted.

### Technical Justification

| Criteria | PostgreSQL | Why |
|----------|------------|-----|
| **Transactions** | Full ACID compliance | Critical for payment and permission consistency |
| **Row-Level Security** | Built-in RLS policies | Enforce authorization at DB level (prevent child data leaks) |
| **Relationships** | Foreign keys, indexes, constraints | Maintain data integrity for complex business logic (parents → students → teachers → sessions) |
| **JSON Support** | Native `JSONB` type | Store flexible data (student notes, preferences) without denormalizing |
| **Scalability** | Vertical and horizontal options | Start at 20–50 students, room to grow |
| **Cost** | Free tier available (Supabase, Railway) | Suitable for startup phase |
| **Ecosystem** | Mature ORMs (TypeORM, Prisma, Sequelize) | Well-documented integration with Node.js backends |
| **Audit Logging** | Triggers, audit tables | Track sensitive operations (who accessed child data, payment changes) |

### Why NOT Other Options

| Alternative | Reason Rejected |
|-------------|-----------------|
| **Firebase / Firestore** | No row-level security; child data privacy risk. Harder to enforce authorization at collection level. |
| **MongoDB** | Lacking ACID transactions across documents; harder to enforce constraints. Payment and permission data requires strong consistency. |
| **SQLite** | Suitable only for local development. Single-file limitation makes scaling and multi-process operation problematic. Cannot enforce RLS. |
| **No Database** | All data would be external (Google Forms, Airtable). Operational platform requires full control over data and queries. |

### Implementation Approach

**Phase 1 Foundation**:
```sql
-- Core tables (basic schema)
CREATE TABLE profiles (id UUID PRIMARY KEY, ...);
CREATE TABLE parents (id UUID PRIMARY KEY, profile_id UUID REFERENCES profiles, ...);
CREATE TABLE students (id UUID PRIMARY KEY, parent_id UUID REFERENCES parents, ...);
CREATE TABLE teachers (id UUID PRIMARY KEY, profile_id UUID REFERENCES profiles, ...);
CREATE TABLE sessions (id UUID PRIMARY KEY, student_id UUID, teacher_id UUID, ...);
CREATE TABLE payments (id UUID PRIMARY KEY, student_id UUID, amount DECIMAL, ...);

-- Row-Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "parents_own_children" ON students USING (parent_id = current_user_id());
CREATE POLICY "teachers_see_assigned" ON students USING (id IN (SELECT student_id FROM assignments WHERE teacher_id = current_user_id()));
```

**Hosting Options** (in order of preference):
1. **Supabase** (PostgreSQL + Auth + RLS): Simplest for this use case
2. **Railway**: Simple deploys, reasonable pricing
3. **AWS RDS**: More control, higher setup complexity
4. **Render**: Generous free tier, straightforward config

**Owner Approval Points**:
- [ ] Is PostgreSQL acceptable as the primary database?
- [ ] Should we use Supabase (integrated auth + RLS) or manage PostgreSQL separately?
- [ ] Are there existing databases (current website, payment system) that must be integrated?
- [ ] What are the hosting/infrastructure preferences or existing commitments?

---

## 3. Hosting & Deployment Decision: Vercel or Railway

### Recommended Decision ✅

**Backend & Frontend Hosted Together** using one of:
- **Vercel** (Next.js-optimized, serverless, edge functions)
- **Railway** (simple containers, simpler mental model)

**Justification**: Operational platform is a full-stack Next.js application (React frontend + Node.js backend). Single deployment reduces operational overhead.

### Technology Stack

```
Frontend:     Next.js 14+ (React, TypeScript, RTL CSS)
Backend:      Next.js API routes / Node.js (TypeScript)
Database:     PostgreSQL (Supabase, Railway, AWS RDS)
Auth:         JWT + secure cookies (built into Next.js)
Payments:     Fawaterk (external, existing integration)
Email:        SendGrid or Resend (transactional only)
Storage:      AWS S3 or Cloudinary (if documents/uploads needed)
```

### Hosting Comparison

| Feature | Vercel | Railway |
|---------|--------|---------|
| **Setup Time** | 5 min (GitHub integration) | 10 min |
| **Cost** | Free tier + $20+/month | Free tier + $5+/month |
| **Scaling** | Automatic serverless | Automatic containers |
| **Database** | External PostgreSQL | Built-in PostgreSQL optional |
| **Environment Vars** | Simple dashboard | Simple dashboard |
| **Rollback** | One-click previous version | Git revert + redeploy |
| **RTL/SSR** | Full support | Full support |
| **Learning Curve** | Gentle (Git push → deploy) | Gentle (Git push → deploy) |

### Why NOT Other Approaches

| Alternative | Reason Rejected |
|-------------|-----------------|
| **Self-Hosted (VPS)** | Adds ops burden (patching, scaling, security). Overkill for 50 students. |
| **Separate frontend/backend** | Unnecessary complexity. Single Next.js app handles both cleanly. |
| **Static site** | Operational platform requires real-time data, authentication, payments. Must be dynamic. |
| **Heroku** | Pricing increased; free tier removed. Vercel/Railway better value. |

### Recommended Configuration

**Option A: Vercel + Supabase (Recommended)**
```
Frontend/Backend: Vercel (Next.js)
  └─ Automatic deploys from main branch
  └─ Preview deployments for every PR
Database: Supabase (PostgreSQL + Auth)
  └─ Row-level security built-in
  └─ Real-time subscriptions (optional)
Email: Resend (serverless, Vercel-friendly)
Payments: Fawaterk (external, unchanged)
```

**Option B: Railway (All-in-One)**
```
Frontend/Backend: Railway (Next.js container)
Database: Railway PostgreSQL
  └─ Same project, shared networking
Email: SendGrid
Payments: Fawaterk (external, unchanged)
```

### Owner Approval Points**:
- [ ] Is Vercel or Railway acceptable, or does the team have existing infrastructure commitments (AWS, Google Cloud, etc.)?
- [ ] Should we use Supabase for integrated auth, or build auth separately?
- [ ] Are there compliance/data residency requirements (GDPR, data must stay in specific region)?
- [ ] Who will have production deployment access?

---

## 4. Authentication & Authorization Decision

### Recommended Decision ✅

**Use JWT-based authentication with secure HTTP-only cookies** for session management.

**Authorization enforced at three layers**:
1. **Frontend**: Hide UI elements (convenience only)
2. **Backend API**: Validate JWT and role (primary defense)
3. **Database**: Row-level security policies (defense in depth)

### Architecture

```
User Login
  ↓
[Next.js API Route: /api/auth/login]
  → Validate email/password
  → Issue JWT token
  → Set HTTP-only cookie (secure, sameSite=strict)
  ↓
[Protected API Routes]
  → Verify JWT token
  → Extract user_id and role
  → Check authorization (is this user allowed to access this resource?)
  → Query database (RLS policy filters rows at DB level)
  ↓
[Database Queries]
  → SELECT * FROM students WHERE parent_id = $current_user_id
  → RLS policy enforces: can only see own children
  ↓
Response (safe data only)
```

### Roles & Permissions

| Role | Max Users | Child Data Access | Financial Access | Operations |
|------|-----------|-------------------|------------------|------------|
| **Admin** | 2–3 | View all students | View all payments | Full system access |
| **Operations** | 2–3 | Manage students, assign teachers, schedule | View subscription status | No financial approval |
| **Finance** | 1 | View only linked students (reports only) | Manage payments, invoicing | No student mgmt |
| **Teacher** | 10–20 | View only assigned students | None (no access) | View own sessions, submit reports |
| **Parent** | 20–50 | View only own children | View own subscription/invoices | Submit requests (leave, makeup, etc.) |

### Why NOT Other Auth Approaches

| Alternative | Reason Rejected |
|-------------|-----------------|
| **Session-based cookies (no JWT)** | Simpler for traditional apps, but complicates scaling. JWT is modern standard. |
| **Firebase Auth** | Acceptable but couples to Firebase. JWT is portable if hosting changes. |
| **Supabase Auth** | Great option if using Supabase DB. Handles JWT + RLS automatically. |
| **OAuth-only (Google/GitHub)** | Good as secondary option, but operational platform needs email/password as primary (WhatsApp users may not have Google account). |

### Owner Approval Points**:
- [ ] Is JWT-based auth acceptable?
- [ ] Should we include OAuth (Google login) as secondary option for convenience?
- [ ] Are there identity provider requirements (school AD, company SSO)?
- [ ] Are there logging/audit requirements for sensitive operations?

---

## 5. Current Data Migration: Plan & Risks

### Current State

**No structured data exists yet** for the operational platform:
- Public website uses Fawaterk (payment processor)
- WhatsApp and manual email used for communication
- No database storing student/teacher/session data
- Testimonials visible on website (fictional or real, TBD)

### Recommended Decision ✅

**Phase 0: Manual Launch**

1. **DO NOT** attempt to export or migrate current student data initially
2. **DO** establish new system with clean seed data (fictional families, teachers, students)
3. **DO** run new system in parallel with existing WhatsApp-based flow for Phase 1–2
4. **Phase 3+ (Operational Readiness)**: After operations team confirms system reliability, gradually transition active students to platform

### Why This Approach

| Reason | Benefit |
|--------|---------|
| **Zero risk of data loss** | No destructive migrations; can roll back immediately |
| **Safety for children's data** | New system audited before real student data enters |
| **Ops team confidence** | Team uses system for 2–4 weeks before "live" transition |
| **Rollback always possible** | If platform breaks, revert to WhatsApp for that week |
| **Legal/Privacy** | Time to implement audit logging before sensitive data handled |

### Data Entry Timeline

```
Week 1–2:   Platform launches with seed data (fictional families)
Week 3–4:   Ops team uses platform daily, identifies issues
Week 5+:    Gradual transition: New leads → Platform, Existing students (opt-in) → Platform
Month 2+:   All students active on platform
```

### Specific Risks Mitigated

| Risk | Mitigation |
|------|-----------|
| **Child data exposure** | Data only enters system after audit completed, RLS tested, no real student data used until phase 3 |
| **Payment data loss** | Fawaterk remains external system of record; platform only tracks subscription status |
| **Corrupted reports** | Session reports editable only within time window; audit log tracks all changes |
| **Teacher seeing unassigned students** | Extensive permission testing before any real data; RLS policies prevent accidents |
| **WhatsApp continuity broken** | Both systems run in parallel until ops team confident to switch |

### Owner Approval Points**:
- [ ] Is a 2–4 week parallel-run period acceptable before transitioning live students?
- [ ] Do you have a list of current active students to migrate gradually (not bulk)?
- [ ] Should we export any historical data from Fawaterk for reference?
- [ ] Who will manage the gradual transition and validate data integrity?

---

## 6. Cross-Cutting Technical Decisions

### 6.1 Frontend Framework: Next.js 14+ with TypeScript

**Why Next.js**:
- Built-in API routes (no separate backend server needed)
- Server-side rendering + static generation (performance, SEO)
- Middleware support (auth, logging)
- Image optimization
- TypeScript support out-of-box

**Arabic RTL Setup**:
```tsx
// next.config.js
module.exports = {
  i18n: {
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
  },
  // Direction plugin for RTL
};

// app/layout.tsx
<html dir="rtl" lang="ar">
```

**Owner Approval**: [ ] Is Next.js + TypeScript + React acceptable?

---

### 6.2 API Design: RESTful with JWT Authorization

**Pattern**:
```
GET  /api/students
  Header: Authorization: Bearer <token>
  Query: ?parent_id=<id>&status=active
  Response: { data: [...], meta: { total: 5 } }

POST /api/sessions/:id/report
  Body: { attendance: 'present', performance: 'good', note: 'Good progress' }
  Response: { success: true, report_id: '...' }
```

**Security**:
- All endpoints require valid JWT
- Rate limiting: 100 req/min per user
- Input validation: Zod or Joi schema validation
- CORS: Allow only `app.ratel-quran.com`

**Owner Approval**: [ ] Is REST API appropriate, or is GraphQL required?

---

### 6.3 Session Management: JWT + Refresh Tokens

**Flow**:
```
Login → Issue access token (15 min expiry) + refresh token (7 days)
  ↓
Use access token for requests
  ↓
If access expired, use refresh token to get new access token
  ↓
Logout → Invalidate refresh token
```

**Owner Approval**: [ ] Is 15-minute access token expiry acceptable?

---

### 6.4 Email & Notifications: SendGrid or Resend

**Use Cases**:
- Registration confirmation
- Session reminder (24h before)
- Session report link (same day)
- Payment due reminder (3 days before, 1 day before)
- Leave/makeup request status

**Why external service**: Ensures emails don't bounce into spam; tracks delivery; handles unsubscribe compliance.

**Owner Approval**: [ ] Can the platform send transactional emails? Any restrictions?

---

### 6.5 Payment Integration: Maintain Fawaterk (No Change)

**Current Integration**: Fawaterk handles secure payment processing.

**Platform Role**: Track subscription status only (paid/due/overdue/refunded). **Never** handle card data.

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES students,
  fawaterk_link TEXT,         -- Link to payment on Fawaterk
  amount DECIMAL,
  status TEXT DEFAULT 'upcoming',  -- upcoming | due | paid | overdue
  due_date DATE,
  paid_date DATE,
  created_at TIMESTAMP
);
```

**Owner Approval**: [ ] Should we integrate Fawaterk API for automated payment status checks, or manual entry?

---

### 6.6 Logging & Audit Trail

**Events to Log**:
- User login/logout (successful and failed)
- User role or permission changes
- Child data accessed by teacher/admin
- Session report submitted
- Payment status updated
- Request approved/rejected

**Log Storage**: PostgreSQL `audit_logs` table.

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles,
  action TEXT,           -- 'login', 'view_student', 'submit_report'
  resource_type TEXT,    -- 'student', 'payment', 'session'
  resource_id UUID,
  timestamp TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);
```

**Owner Approval**: [ ] Is this level of audit logging required?

---

## 7. Blocking Dependencies & Owner Approvals Required

### Before Implementation Starts, Confirm:

**Infrastructure & Domain**:
- [ ] Does the team own `ratel-quran.com` DNS?
- [ ] Can we register/configure subdomain `app.ratel-quran.com`?
- [ ] What is the existing hosting setup (Vercel, AWS, etc.)?
- [ ] Are there cost constraints or existing provider commitments?

**Database**:
- [ ] Is PostgreSQL acceptable?
- [ ] Should we use Supabase (all-in-one) or manage PostgreSQL separately?
- [ ] Any data residency / privacy requirements?

**Authentication**:
- [ ] JWT + HTTP cookies acceptable?
- [ ] OAuth (Google login) needed?
- [ ] Any SSO/LDAP requirements?

**Business & Legal**:
- [ ] Is this parallel-run approach acceptable (2–4 weeks before live transition)?
- [ ] Who approves production deployment (ops team, founder, board)?
- [ ] Are there regulatory requirements (GDPR, child safety, etc.)?

**Team & Operations**:
- [ ] Who will manage the transition of existing students?
- [ ] Will operations team use platform for 2–4 weeks in parallel?
- [ ] Who has production access and who can deploy?

---

## 8. Implementation Timeline (Assuming All Approvals)

| Phase | Duration | Dependencies | Deliverables |
|-------|----------|--------------|--------------|
| **Phase 1: Foundation** | 2 weeks | Approvals 1–7 | Database schema, auth, base layout, CI/CD |
| **Phase 2: Lead Registration** | 2 weeks | Phase 1 | Registration form, lead dashboard, notifications |
| **Phase 3: Student/Teacher Mgmt** | 2 weeks | Phase 2 | Profiles, scheduling, capacity tracking |
| **Phase 4: Teacher Portal** | 2 weeks | Phase 3 | Session reports, attendance, requests |
| **Phase 5: Parent Portal** | 2 weeks | Phase 3 | Child view, schedule, reports, subscription |
| **Phase 6: Admin Dashboard** | 1 week | Phases 3–5 | Metrics, user management, ops overview |
| **Phase 7: Testing & Go-Live** | 2 weeks | Phases 1–6 | Security tests, performance tests, documentation, approval |

**Total: ~13 weeks (3 months) if sequential.**  
**Parallel work possible**: Phases 4 and 5 can run alongside Phase 3, reducing to ~8–10 weeks.

---

## 9. Success Criteria (After Owner Approval & Implementation)

**Technical**:
- [ ] All existing public website routes still work (SEO, performance unchanged)
- [ ] New platform at `app.ratel-quran.com` loads in <2 seconds
- [ ] JWT authentication working; unauthorized access blocked
- [ ] Database RLS prevents teacher from seeing unassigned students
- [ ] Parent cannot see another family's data
- [ ] RTL/Arabic layout pixel-perfect on mobile

**Operational**:
- [ ] Ops team uses platform for 2+ weeks without critical bugs
- [ ] No child data exposed or lost
- [ ] All payment integrations with Fawaterk working
- [ ] Email notifications delivering reliably
- [ ] Audit logs recording all sensitive operations

**Documentation**:
- [ ] Deployment guide (how to access production, rollback plan)
- [ ] Ops manual (how to add students, assign teachers, etc.)
- [ ] Security checklist (auth, RLS, logs, backups)
- [ ] Data privacy statement (where data stored, who accesses it)

---

## Next Steps

1. **Owner Reviews** this document
2. **Owner Provides Feedback** on each section (approvals noted with checkboxes)
3. **Team Incorporates Feedback** into final ARCHITECTURE.md
4. **Phase 1 Implementation Starts** only after written approval

**This is a decision document, not an implementation plan. No code changes will be made until explicit owner approval is received.**

---

**Document Status**: ⏳ Awaiting Owner Review and Approval  
**Last Updated**: 21 July 2026  
**Next Review**: After owner feedback received
