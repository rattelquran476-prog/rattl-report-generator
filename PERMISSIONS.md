# PERMISSIONS.md: Rattel Operational Platform

**Document Version**: 1.0  
**Last Updated**: 21 July 2026  
**Status**: Draft — awaiting owner approval  
**Scope**: Permission and access-control documentation only. No code, migrations, policies, or database changes have been implemented.

---

## 1. Permissions Overview

The Rattel operational platform handles sensitive child, family, teacher, schedule, report, request, and payment-tracking data.

The permission model must ensure that every user sees only the data required for their role.

The platform roles are:

1. **Admin**
2. **Operations**
3. **Finance**
4. **Teacher**
5. **Parent**

Permissions must be enforced at three layers:

1. **Frontend visibility** — hides irrelevant navigation and UI elements.
2. **Server-side authorization** — validates every request before returning data.
3. **Supabase Row-Level Security** — prevents unauthorized database row access.

Frontend hiding is never enough. All sensitive access must be enforced server-side and database-side.

---

## 2. Security Principles

The access-control system must follow these principles:

- Deny by default.
- Grant only the minimum required access.
- Never trust frontend state.
- Never expose one child’s data to another family.
- Never expose students to unassigned teachers.
- Never expose payments to teachers.
- Never expose educational reports to finance unless explicitly approved.
- Never expose internal admin notes to parents.
- Never store or expose card data.
- Log sensitive actions.
- Use fictional seed data until permissions are fully tested.
- No production deployment without explicit owner approval.

---

## 3. User Roles

---

## 3.1 Admin

Admin has full platform access.

### Can access

- All users.
- All parents.
- All students.
- All teachers.
- All leads.
- All assessments.
- All enrollments.
- All schedules.
- All sessions.
- All session reports.
- All requests.
- All subscriptions.
- All payments.
- All notifications.
- All audit logs.

### Can perform

- Create, edit, suspend, and disable users.
- Assign and change roles.
- Manage students and teachers.
- Manage schedules and sessions.
- Review all reports.
- Manage subscriptions and payment tracking.
- Review and close requests.
- View and export operational data if exports are approved.
- Review audit logs.

### Restrictions

Even Admin must not:

- Store card data.
- Store secrets in Git.
- Send child data to AI tools without explicit consent.
- Deploy production changes without approval.
- Delete sensitive records without a retention/backup policy.

---

## 3.2 Operations

Operations manages daily platform operations.

### Can access

- Leads.
- Parents.
- Students.
- Teachers.
- Assessments.
- Enrollments.
- Teacher availability.
- Schedules.
- Sessions.
- Session reports.
- Requests.
- Limited subscription status.
- Limited payment status.
- Limited audit logs related to operational actions.

### Can perform

- Review new family registrations.
- Move leads through lead stages.
- Create parent and student records after approval.
- Assign teachers to students.
- Create and update schedules.
- Review teacher-submitted reports.
- Review parent and teacher requests.
- Approve, reject, schedule, or complete requests.
- Mark students as active, paused, at risk, withdrawn, or completed.
- View operational dashboards and capacity metrics.

### Restrictions

Operations must not:

- Access full payment details unless explicitly needed.
- Update financial payment records unless delegated.
- View card data, because card data must never exist in the platform.
- Change system roles unless granted by Admin.
- Expose internal admin notes to parents or teachers.

---

## 3.3 Finance

Finance manages subscriptions and payment tracking only.

### Can access

- Subscriptions.
- Payments.
- Parent billing contact information.
- Student basic metadata required for billing:
  - Student name.
  - Parent name.
  - Subscription status.
  - Package/session count.
  - Enrollment status.
- External payment link.
- Receipt link.
- Payment reference.

### Can perform

- Create and update payment records.
- Update payment status.
- Add external Fawaterk payment links.
- Add receipt links.
- Mark payment as paid, overdue, waived, refunded, cancelled.
- View finance dashboard.
- Review payment-related requests.

### Restrictions

Finance must not access:

- Session report content.
- Teacher notes.
- Parent educational notes.
- Student performance details.
- Admin educational notes.
- Teacher internal notes.
- Private child progress reports except minimal metadata required for billing.
- Any card number, CVV, or full PAN.

---

## 3.4 Teacher

Teacher can access only assigned students and their own sessions.

### Can access

- Own teacher profile.
- Own availability.
- Students assigned to them.
- Own schedules.
- Own sessions.
- Session reports they created.
- Requests they submitted.
- Parent-visible fields needed for teaching.
- Limited student learning profile:
  - Name.
  - Age.
  - Gender.
  - Reading level.
  - Memorization level.
  - Current goal.
  - Service path.
  - Parent-safe notes if provided by operations.

### Can perform

- View today’s sessions.
- View weekly schedule.
- Mark attendance.
- Submit session reports.
- Submit teacher leave requests.
- Submit makeup-session requests.
- View status of own requests.
- Update own availability if allowed by operations.
- Edit reports only within the admin-configured edit window.

### Restrictions

Teacher must not access:

- Students assigned to other teachers.
- Parent payment records.
- Subscription price or payment status.
- Other teachers’ schedules unless explicitly shared by Admin.
- Admin-only student notes.
- Finance notes.
- Audit logs.
- Raw lead data unless assigned to assessment.
- Internal complaint details unrelated to their own sessions.

---

## 3.5 Parent

Parent can access only their own family and children.

### Can access

- Own parent profile.
- Own children.
- Own children’s schedules.
- Own children’s sessions.
- Own children’s parent-visible reports.
- Own subscription status.
- Own payment status and payment link.
- Own requests.
- Notifications addressed to them.

### Can perform

- View child dashboard.
- Switch between own children.
- View upcoming sessions.
- View latest reports.
- View homework.
- View parent-visible teacher notes.
- Submit leave requests.
- Submit makeup requests.
- Submit schedule-change requests.
- Submit pause/resume subscription requests.
- Update own contact details if allowed.

### Restrictions

Parent must not access:

- Other families.
- Other children.
- Other parents.
- Other teachers’ students.
- Internal admin notes.
- Teacher internal notes.
- Finance internal notes.
- Audit logs.
- Raw database IDs of unrelated users.
- Any operational dashboard.

---

## 4. Global Access Rules

These rules apply to the entire platform:

1. Every request must be authenticated unless it is a public registration form submission.
2. Public registration must allow create-only access through a server-side endpoint.
3. All private routes require an active authenticated session.
4. Every API route must check:
   - User identity.
   - Role.
   - Record ownership or assignment.
   - Requested action.
5. Every database query must be scoped by the current user role and ownership rules.
6. Supabase RLS must be enabled for all sensitive tables.
7. No frontend route should assume that hidden UI is security.
8. Internal notes must be returned only to authorized roles.
9. Sensitive operations must create audit log entries.
10. Any access failure must return a safe error without leaking system details.

---

## 5. Role Permission Matrix

| Area | Admin | Operations | Finance | Teacher | Parent |
|---|---|---|---|---|---|
| User management | Full | Limited | Own only | Own only | Own only |
| Leads | Full | Full | None | Assigned assessment only | Create public lead only |
| Parents | Full | Full | Billing metadata only | None | Own record only |
| Students | Full | Full | Limited metadata | Assigned only | Own children only |
| Teachers | Full | Full | None | Own record only | Assigned teacher display only |
| Teacher availability | Full | Full | None | Own availability | None |
| Assessments | Full | Full | None | Assigned only | Parent-safe summary only |
| Enrollments | Full | Full | Limited status | Assigned only | Own children only |
| Schedules | Full | Full | None | Own sessions only | Own children only |
| Sessions | Full | Full | None | Own sessions only | Own children only |
| Session reports | Full | Full | None | Own reports only | Own child reports only |
| Subscriptions | Full | Status visibility | Full | None | Own child status only |
| Payments | Full | Status visibility | Full | None | Own payment link/status only |
| Requests | Full | Full | Payment-related only | Own/assigned only | Own only |
| Notifications | Full | Operational visibility | Finance-related only | Own only | Own only |
| Audit logs | Full | Limited | None | None | None |

---

## 6. Table-Level Permissions

---

## 6.1 profiles

### Admin

- Full read/write access.

### Operations

- Read staff, parent, and teacher profiles needed for operations.
- May invite parent or teacher users if approved.
- May not assign Admin role.

### Finance

- Read own profile.
- Read limited parent billing contact fields if connected to payment records.

### Teacher

- Read and update own profile only.

### Parent

- Read and update own profile only.

---

## 6.2 parents

### Admin

- Full access.

### Operations

- Full operational access.

### Finance

- Read billing-related fields only:
  - Name.
  - Email.
  - WhatsApp.
  - Country.
  - Timezone.

### Teacher

- No direct parent record access unless a parent-safe contact workflow is approved.

### Parent

- Own parent record only.

### Restricted fields

- `notes_internal` visible only to Admin and Operations.

---

## 6.3 students

### Admin

- Full access.

### Operations

- Full access.

### Finance

- Limited metadata only:
  - Student name.
  - Parent link.
  - Enrollment/subscription status.
  - Package/session count if relevant.

### Teacher

- Assigned students only.

### Parent

- Own children only.

### Restricted fields

- `admin_notes` visible only to Admin and Operations.
- Finance must not access reading/memorization notes unless explicitly required.
- Parent must not access internal risk commentary unless converted to parent-safe guidance.

---

## 6.4 teachers

### Admin

- Full access.

### Operations

- Full access for assignment and capacity planning.

### Finance

- No access by default.

### Teacher

- Own teacher record only.

### Parent

- Limited assigned teacher display only:
  - Teacher display name.
  - Session-related contact method if approved.
  - Meeting link if needed.

### Restricted fields

- `internal_notes` visible only to Admin and Operations.
- `admin_rating` visible only to Admin and Operations.

---

## 6.5 leads

### Admin

- Full access.

### Operations

- Full access.

### Finance

- No access before enrollment/payment stage unless explicitly required.

### Teacher

- Can access only leads assigned to them for assessment.

### Parent/Public

- Public can create a lead through a protected server-side form endpoint.
- Public cannot read, update, or list leads.

### Restricted fields

- Duplicate detection fields and internal follow-up data visible only to Admin and Operations.

---

## 6.6 assessments

### Admin

- Full access.

### Operations

- Full access.

### Teacher

- Assigned assessments only.

### Parent

- Parent-safe summary only, if shared.

### Finance

- No access.

### Restricted fields

- `assessment_notes` visible only to Admin, Operations, and assigned teacher.
- `parent_summary` is the only field intended for parent visibility.

---

## 6.7 enrollments

### Admin

- Full access.

### Operations

- Full access.

### Finance

- Limited enrollment and subscription status.

### Teacher

- Assigned enrollments only.

### Parent

- Own children’s enrollment status only.

### Restricted fields

- `notes_internal` visible only to Admin and Operations.

---

## 6.8 teacher_availability

### Admin

- Full access.

### Operations

- Full access.

### Teacher

- Own availability only.

### Finance

- No access.

### Parent

- No direct access.

---

## 6.9 schedules

### Admin

- Full access.

### Operations

- Full access.

### Teacher

- Own schedules only.

### Parent

- Own children’s schedules only.

### Finance

- No access.

### Restrictions

- Schedule creation and updates must validate teacher conflicts server-side.
- Teachers may not self-assign students.
- Parents may request changes but cannot directly edit schedules.

---

## 6.10 sessions

### Admin

- Full access.

### Operations

- Full access.

### Teacher

- Own sessions only.

### Parent

- Own children’s sessions only.

### Finance

- No access.

### Restrictions

- Session status changes must be logged.
- Rescheduling must maintain traceability through linked request or previous session reference.

---

## 6.11 session_reports

### Admin

- Full access.

### Operations

- Full access.

### Teacher

- Own reports for assigned students only.

### Parent

- Parent-visible fields for own children only.

### Finance

- No access.

### Parent-visible fields

Parents may see:

- Attendance status.
- Reviewed material.
- New lesson.
- Performance level.
- Engagement level.
- Homework.
- Parent note.
- Report date.

### Restricted fields

Parents must never see:

- `admin_note`
- Internal intervention discussion.
- Any staff-only note.
- Any unrelated child data.

Teachers must not edit reports after the configured edit window unless Admin or Operations grants permission.

---

## 6.12 subscriptions

### Admin

- Full access.

### Operations

- Status visibility.
- May request subscription changes if workflow requires.

### Finance

- Full access.

### Teacher

- No access.

### Parent

- Own children’s subscription status only.

### Restricted fields

- Finance/admin notes visible only to Admin and Finance.
- Parent may see package, status, renewal date, and payment link where applicable.

---

## 6.13 payments

### Admin

- Full access to payment tracking records.

### Finance

- Full access to payment tracking records.

### Operations

- Limited status visibility only.

### Parent

- Own payment status, due date, external payment link, and receipt link.

### Teacher

- No access.

### Never stored

- Card number.
- CVV.
- Full PAN.
- Raw processor secrets.
- Sensitive authentication tokens.

---

## 6.14 requests

### Admin

- Full access.

### Operations

- Full access.

### Finance

- Payment or subscription-related requests only.

### Teacher

- Own requests.
- Requests involving their assigned sessions or assigned students.

### Parent

- Own requests related to own children.

### Restrictions

- User-visible response should be polite, clear, and parent-safe.
- `admin_notes` must not be shown to parents or teachers.
- Rejected requests must include a respectful user-visible explanation when appropriate.

---

## 6.15 notifications

### Admin

- Full access.

### Operations

- Operational notifications.

### Finance

- Finance-related notifications.

### Teacher

- Own notifications.

### Parent

- Own notifications.

### Restrictions

- External notifications should avoid sensitive child details.
- WhatsApp/email notifications should use minimal data.

---

## 6.16 audit_logs

### Admin

- Full access.

### Operations

- Limited access to operational audit logs if approved.

### Finance

- No access by default.

### Teacher

- No access.

### Parent

- No access.

### Restrictions

Audit logs must not expose secrets, passwords, or full child notes in unsafe contexts.

---

## 7. Field-Level Restrictions

The following fields require special handling.

| Field | Table | Visible To | Hidden From |
|---|---|---|---|
| `admin_notes` | students | Admin, Operations | Parent, Teacher, Finance |
| `internal_notes` | teachers | Admin, Operations | Parent, Teacher, Finance |
| `notes_internal` | parents | Admin, Operations | Parent, Teacher, Finance |
| `assessment_notes` | assessments | Admin, Operations, assigned Teacher | Parent, Finance |
| `parent_summary` | assessments | Parent, Admin, Operations | Finance unless needed |
| `admin_note` | session_reports | Admin, Operations | Parent, Finance |
| `parent_note` | session_reports | Parent, Teacher, Admin, Operations | Finance |
| `notes_internal` | payments | Admin, Finance | Parent, Teacher, Operations unless approved |
| `admin_notes` | requests | Admin, Operations | Parent, Teacher |
| `user_visible_response` | requests | Requester, Admin, Operations | Others |
| `old_values` / `new_values` | audit_logs | Admin only | All others |

---

## 8. Parent Access Rules

Parents can only access records linked to their own `parent_id`.

Parent access must be scoped through:

- Parent profile.
- Children linked to that parent.
- Sessions linked to those children.
- Reports linked to those children.
- Requests submitted by that parent or related to those children.
- Subscription/payment records for those children.

Parents must never access:

- Other families.
- Other students.
- Teacher private data.
- Admin notes.
- Internal operations notes.
- Audit logs.

---

## 9. Teacher Access Rules

Teachers can only access records linked to their own `teacher_id`.

Teacher access must be scoped through:

- Teacher profile.
- Assigned students.
- Own schedules.
- Own sessions.
- Own session reports.
- Own requests.
- Assigned assessments.

Teachers must never access:

- Unassigned students.
- Other teachers’ students.
- Parent payment information.
- Subscription pricing.
- Finance notes.
- Admin-only student notes.
- Audit logs.

---

## 10. Finance Access Rules

Finance access must be limited to payment and subscription tracking.

Finance may access:

- Subscriptions.
- Payments.
- Parent billing contact fields.
- Minimal student metadata required for billing.
- Payment-related requests.

Finance must never access:

- Educational reports.
- Teacher session notes.
- Student progress details.
- Admin educational notes.
- Teacher internal notes.
- Audit logs unless explicitly approved by Admin.

---

## 11. Operations Access Rules

Operations can manage the educational operations workflow.

Operations may access:

- Leads.
- Parents.
- Students.
- Teachers.
- Assessments.
- Enrollments.
- Availability.
- Schedules.
- Sessions.
- Session reports.
- Requests.
- Operational notifications.
- Limited payment status.

Operations must not:

- Store payment card data.
- Change payment processor secrets.
- Access full financial internals unless approved.
- Expose internal notes to parents or teachers.

---

## 12. Admin Access Rules

Admin has full access but remains bound by platform safety rules.

Admin may:

- Manage roles.
- Review all data.
- Configure workflows.
- Review audit logs.
- Approve production changes.
- Manage sensitive settings.

Admin must not:

- Store card data.
- Commit secrets.
- Send child data to third-party AI tools without explicit consent.
- Delete sensitive records without retention policy.
- Bypass audit logging.

---

## 13. Row-Level Security Strategy

Supabase RLS is required on all sensitive tables.

### RLS goals

- Parents see only their own children.
- Teachers see only assigned students.
- Finance sees only payment/subscription records.
- Operations sees operational records.
- Admin sees all records.

### RLS principles

- Enable RLS for every application table.
- Deny access by default.
- Create explicit policies per role and table.
- Use authenticated user identity from Supabase Auth.
- Resolve role through `profiles.role`.
- Resolve parent identity through `parents.profile_id`.
- Resolve teacher identity through `teachers.profile_id`.
- Do not allow direct public reads from sensitive tables.
- Public lead creation must go through a controlled server-side path.

### RLS must cover

- profiles
- parents
- students
- teachers
- leads
- assessments
- enrollments
- teacher_availability
- schedules
- sessions
- session_reports
- subscriptions
- payments
- requests
- notifications
- audit_logs

---

## 14. Server-Side Authorization Rules

Every server-side route must check:

1. Is the user authenticated?
2. Is the user active?
3. What is the user role?
4. Is the action allowed for this role?
5. Is the target record linked to this user?
6. Are restricted fields being requested?
7. Should this action be audit-logged?

Server-side authorization must be applied before:

- Reading records.
- Creating records.
- Updating records.
- Deleting or closing records.
- Exporting data.
- Sending notifications.
- Updating payment status.
- Assigning teachers.
- Changing roles.

---

## 15. Frontend Visibility Rules

Frontend visibility is a convenience layer only.

The frontend may:

- Hide unauthorized navigation items.
- Hide unauthorized buttons.
- Hide restricted fields.
- Redirect unauthorized users away from pages.
- Show role-specific dashboards.

The frontend must not be trusted to:

- Enforce final access.
- Protect API endpoints.
- Protect restricted fields.
- Prevent role escalation.
- Prevent cross-family data access.

All frontend restrictions must be backed by server-side and RLS enforcement.

---

## 16. Sensitive Fields That Must Never Leak

These fields must never be exposed to unauthorized roles:

- `students.admin_notes`
- `parents.notes_internal`
- `teachers.internal_notes`
- `teachers.admin_rating`
- `assessments.assessment_notes`
- `session_reports.admin_note`
- `requests.admin_notes`
- `payments.notes_internal`
- `audit_logs.old_values`
- `audit_logs.new_values`
- Environment variables.
- API keys.
- Payment processor secrets.
- Password reset tokens.
- Refresh tokens.
- Any card data.

---

## 17. Session Report Visibility Rules

### Teacher view

Teacher can see:

- Reports they created.
- Reports for assigned students.
- Editable reports within the edit window.

Teacher cannot see:

- Reports from other teachers.
- Finance notes.
- Internal admin-only review unless shared.

### Parent view

Parent can see:

- Attendance status.
- Reviewed material.
- New lesson.
- Performance level.
- Engagement level.
- Homework.
- Parent note.
- Report date.

Parent cannot see:

- Admin note.
- Intervention internal reason if not parent-safe.
- Other students’ reports.
- Teacher internal notes.

### Operations/Admin view

Operations and Admin can see full session report details, including internal notes and intervention flags.

### Finance view

Finance cannot see session reports.

---

## 18. Payment and Subscription Visibility Rules

### Admin

Full payment tracking access.

### Finance

Full payment tracking access except secrets and card data.

### Operations

Can see:

- Subscription status.
- Payment status.
- Due/overdue flag.

Cannot see:

- Internal finance notes unless approved.
- Processor secrets.

### Parent

Can see:

- Current subscription status.
- Payment due date.
- External payment link.
- Receipt link.
- Paid/unpaid status.

Cannot see:

- Internal finance notes.
- Other families’ payments.
- Processor references unless parent-safe.
- Any card data.

### Teacher

No payment or subscription access.

---

## 19. Request Workflow Permissions

Request types:

- Parent Leave
- Teacher Leave
- Makeup Session
- Schedule Change
- Pause Subscription
- Resume Subscription
- Change Session Count
- Complaint
- General Inquiry

### Parent request permissions

Parents may create:

- Parent Leave.
- Makeup Session.
- Schedule Change.
- Pause Subscription.
- Resume Subscription.
- Change Session Count.
- Complaint.
- General Inquiry.

Parents may view:

- Own requests.
- Status.
- User-visible response.
- Scheduled alternative time if approved.

Parents may not view:

- Internal admin notes.
- Other family requests.

### Teacher request permissions

Teachers may create:

- Teacher Leave.
- Makeup Session.
- Schedule Change.
- General Inquiry.

Teachers may view:

- Own requests.
- Requests connected to own sessions if relevant.
- User-visible response.

Teachers may not view:

- Parent complaints unrelated to them unless assigned.
- Internal admin notes.
- Payment-related requests.

### Operations request permissions

Operations may:

- Review all operational requests.
- Approve or reject.
- Schedule makeup sessions.
- Close completed requests.
- Add internal notes.
- Add user-visible responses.

### Finance request permissions

Finance may:

- Review payment/subscription-related requests.
- Update payment/subscription status.
- Add finance notes.
- Add user-visible finance responses.

### Admin request permissions

Admin has full access to all requests.

---

## 20. Audit Logging Requirements

Audit logs are required for sensitive actions.

### Must log

- Login success and failure.
- Password reset request.
- Role changes.
- User invite.
- Parent profile update.
- Student profile view by staff.
- Student profile update.
- Teacher assignment changes.
- Schedule creation.
- Schedule update.
- Session status change.
- Session report creation.
- Session report update.
- Intervention-needed report submission.
- Request approval.
- Request rejection.
- Payment status change.
- Subscription status change.
- Data export if exports are later added.

### Audit log fields

Audit logs should capture:

- Actor profile id.
- Actor role.
- Action.
- Target table.
- Target record id.
- Timestamp.
- IP address where relevant.
- User agent where relevant.
- Old values for updates where safe.
- New values for updates where safe.

### Must not log

- Passwords.
- Access tokens.
- Refresh tokens.
- API secrets.
- Full card data.
- CVV.
- Sensitive child notes in unsafe logs.
- Full WhatsApp body if it contains private child information.

---

## 21. Permission Test Scenarios

Before real child data is entered, the following tests must pass.

### Parent tests

- Parent A cannot see Parent B profile.
- Parent A cannot see Parent B child.
- Parent A cannot see Parent B session.
- Parent A cannot see Parent B report.
- Parent cannot see `session_reports.admin_note`.
- Parent cannot access audit logs.
- Parent cannot update payment status.

### Teacher tests

- Teacher A cannot see Teacher B students.
- Teacher A cannot see Teacher B sessions.
- Teacher A cannot submit report for unassigned student.
- Teacher cannot see payments.
- Teacher cannot see subscriptions.
- Teacher cannot access admin notes.
- Teacher cannot update own role.

### Finance tests

- Finance can update payment status.
- Finance cannot see session reports.
- Finance cannot see teacher internal notes.
- Finance cannot see student educational progress fields unless explicitly approved.
- Finance cannot assign teachers.
- Finance cannot update schedules.

### Operations tests

- Operations can move lead status.
- Operations can assign teacher.
- Operations can create schedule.
- Operations can review reports.
- Operations can approve requests.
- Operations cannot access processor secrets.
- Operations cannot store card data.

### Admin tests

- Admin can manage users.
- Admin can change roles.
- Admin can view audit logs.
- Admin actions create audit logs.
- Admin cannot bypass production approval policy.

### RLS tests

- Direct database access as parent returns only own children.
- Direct database access as teacher returns only assigned students.
- Direct database access as finance returns only payment/subscription scope.
- Direct database access as anonymous user returns no sensitive data.
- Public lead insert is possible only through approved server-side flow.

---

## 22. Common Access Violations to Prevent

The implementation must prevent:

- Parent seeing another family’s child.
- Teacher seeing unassigned student.
- Finance reading session reports.
- Teacher reading payments.
- Parent reading admin notes.
- Public user listing leads.
- User changing their own role.
- User accessing another user’s notifications.
- API returning hidden fields by accident.
- Bulk export bypassing permissions.
- Internal notes being included in email/WhatsApp notifications.
- Payment processor secrets being exposed to frontend.
- RLS being disabled in production.
- Test data containing real children.
- Logs containing full child notes or secrets.

---

## 23. Non-Goals

This document does not:

- Create Supabase policies.
- Create SQL migrations.
- Create database tables.
- Create API code.
- Create frontend guards.
- Create test files.
- Deploy anything.
- Import real data.
- Store production secrets.

This document only defines the permission model that must be approved before implementation.

---

## 24. Owner Approval Checklist

Before implementation, the owner must approve:

- [ ] Five-role model: Admin, Operations, Finance, Teacher, Parent.
- [ ] Parent access limited to own children only.
- [ ] Teacher access limited to assigned students only.
- [ ] Finance access limited to subscriptions/payments and minimal metadata.
- [ ] Operations access to operational workflows.
- [ ] Admin full access with audit logging.
- [ ] Internal admin notes hidden from parents and teachers.
- [ ] Session reports hidden from Finance.
- [ ] Payment data hidden from Teacher.
- [ ] RLS required on sensitive tables.
- [ ] Server-side authorization required for every protected endpoint.
- [ ] Frontend visibility is convenience only.
- [ ] Audit logs required for sensitive operations.
- [ ] Fictional seed data only until permission tests pass.
- [ ] No real child data before RLS and permission tests pass.

---

**Status**: Draft — awaiting owner approval.  
**Next Step**: Review and approve before creating RLS policies, tests, migrations, or application code.
