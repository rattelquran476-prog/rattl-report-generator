# TESTING.md: Rattel Operational Platform

**Document Version**: 1.0  
**Last Updated**: 21 July 2026  
**Status**: Draft — awaiting owner approval  
**Scope**: Testing strategy documentation only. No application code, dependencies, migrations, database tables, or test files have been implemented.

---

## 1. Testing Overview

The Rattel operational platform handles sensitive child, parent, teacher, session, report, request, subscription, and payment-tracking data.

Testing must prove that:

- Parents can access only their own children.
- Teachers can access only assigned students.
- Finance can access only payment and subscription data.
- Operations can manage operational workflows without accessing unnecessary financial secrets.
- Admin can manage the platform with full audit logging.
- Internal notes never leak to unauthorized roles.
- No card data is stored or exposed.
- No real child data is used before security and permission tests pass.
- Supabase Row-Level Security and server-side authorization are both enforced.
- The public marketing website remains untouched.

Testing is required before implementation, before staging use, before production use, and before importing real student data.

---

## 2. Testing Principles

All testing must follow these principles:

1. **Deny by default**  
   Every role should be blocked unless explicitly allowed.

2. **Test with fictional data only**  
   No real child names, parent phone numbers, teacher private data, or payment references may be used in tests or seed data.

3. **Test every permission at multiple layers**  
   A permission must be verified at:
   - Frontend visibility layer.
   - Server-side API layer.
   - Supabase Row-Level Security layer.

4. **Never rely on frontend hiding**  
   Hidden buttons and pages are not security. API and RLS tests are mandatory.

5. **Test negative cases first**  
   The most important tests are access-denied scenarios.

6. **Protect child data above convenience**  
   Any ambiguous data access should fail closed.

7. **No production deployment without explicit owner approval**  
   Passing tests does not automatically authorize deployment.

---

## 3. Test Data Policy

Testing must use fictional data only.

### Allowed test data

- Fictional parent accounts.
- Fictional student names.
- Fictional teachers.
- Fictional sessions.
- Fictional reports.
- Fictional subscriptions.
- Fake payment links.
- Fake Fawaterk references.
- Fake WhatsApp numbers such as `+0000000000`.
- Test email domains such as `example.com`.

### Forbidden test data

- Real child names.
- Real parent names connected to real children.
- Real WhatsApp numbers.
- Real payment references.
- Real teacher private data.
- Screenshots containing real student information.
- Any production secrets.
- Any real card data.

---

## 4. Test Roles

The following fictional accounts should exist in test/staging environments.

| Role | Example Account | Purpose |
|---|---|---|
| Admin | admin@example.com | Full platform management |
| Operations | operations@example.com | Student, teacher, schedule, and request workflows |
| Finance | finance@example.com | Subscription and payment tracking |
| Teacher A | teacher.a@example.com | Assigned to Student A only |
| Teacher B | teacher.b@example.com | Assigned to Student B only |
| Parent A | parent.a@example.com | Parent of Student A |
| Parent B | parent.b@example.com | Parent of Student B |
| Anonymous | not logged in | Public form and unauthenticated access tests |

### Fictional relationship setup

- Parent A owns Student A.
- Parent B owns Student B.
- Teacher A is assigned to Student A.
- Teacher B is assigned to Student B.
- Finance has no educational access.
- Operations can manage both students.
- Admin can manage all records.

---

## 5. Permission Test Matrix

| Scenario | Admin | Operations | Finance | Teacher A | Parent A | Anonymous |
|---|---|---|---|---|---|---|
| View Student A | Allow | Allow | Limited metadata | Allow | Allow | Deny |
| View Student B | Allow | Allow | Limited metadata | Deny | Deny | Deny |
| View Student A payment | Allow | Limited status | Allow | Deny | Allow limited | Deny |
| View Student A report | Allow | Allow | Deny | Allow | Allow parent-safe | Deny |
| View admin notes | Allow | Allow | Deny | Deny | Deny | Deny |
| Update payment status | Allow | Deny or limited | Allow | Deny | Deny | Deny |
| Submit session report | Allow | Allow if delegated | Deny | Allow own only | Deny | Deny |
| Submit parent request | Allow | Allow | Deny | Deny | Allow own only | Deny |
| Create lead | Allow | Allow | Deny | Deny | Allow public form | Allow via public form only |
| View audit logs | Allow | Limited if approved | Deny | Deny | Deny | Deny |

---

## 6. Parent Access Tests

### Parent must be allowed to

- Log in to their own account.
- View their own parent profile.
- View their own children.
- Switch between their own children.
- View their own children’s schedules.
- View their own children’s sessions.
- View parent-safe session reports.
- View homework and parent note.
- View own subscription status.
- View own payment due date.
- View own external payment link.
- Submit leave request.
- Submit makeup request.
- Submit schedule-change request.
- Submit subscription pause or resume request.
- View own requests and user-visible responses.

### Parent must be denied from

- Viewing another parent profile.
- Viewing another family’s child.
- Viewing another child’s schedule.
- Viewing another child’s session.
- Viewing another child’s report.
- Viewing `session_reports.admin_note`.
- Viewing `students.admin_notes`.
- Viewing teacher internal notes.
- Viewing finance notes.
- Viewing audit logs.
- Updating payment status.
- Updating subscription status.
- Changing teacher assignment.
- Creating or modifying schedules directly.
- Changing their own role.
- Viewing raw records not linked to their family.

### Required parent test cases

- Parent A cannot view Student B.
- Parent A cannot view Student B report.
- Parent A cannot view Student B payment status.
- Parent A cannot view Parent B profile.
- Parent A cannot access Admin dashboard.
- Parent A cannot access Teacher dashboard.
- Parent A cannot access Finance dashboard.
- Parent A cannot see internal admin notes in reports.
- Parent A cannot create a request for Student B.
- Parent A can create a request for Student A.

---

## 7. Teacher Access Tests

### Teacher must be allowed to

- Log in to their own account.
- View own teacher profile.
- View own availability.
- View assigned students only.
- View own sessions only.
- View own weekly schedule.
- View assigned student learning profile.
- Mark attendance for own sessions.
- Submit reports for own sessions.
- Edit own reports within configured edit window.
- Submit teacher leave request.
- Submit makeup request for own sessions.
- View status of own requests.

### Teacher must be denied from

- Viewing unassigned students.
- Viewing another teacher’s students.
- Viewing another teacher’s sessions.
- Submitting reports for unassigned students.
- Viewing parent payment records.
- Viewing subscription prices.
- Viewing Finance dashboard.
- Viewing Admin dashboard.
- Viewing audit logs.
- Viewing admin-only student notes.
- Viewing another teacher’s private notes.
- Changing own role.
- Assigning students to self.
- Updating payment status.
- Creating parent accounts.

### Required teacher test cases

- Teacher A can view Student A.
- Teacher A cannot view Student B.
- Teacher A can submit report for Student A session.
- Teacher A cannot submit report for Student B session.
- Teacher A cannot see payments.
- Teacher A cannot see subscriptions.
- Teacher A cannot see `students.admin_notes`.
- Teacher A cannot see `payments.notes_internal`.
- Teacher A cannot update their own role.
- Teacher A cannot assign themselves to a new student.

---

## 8. Finance Access Tests

### Finance must be allowed to

- Log in to Finance dashboard.
- View subscription records.
- View payment records.
- View payment due dates.
- View payment status.
- View external payment links.
- View receipt links.
- Update payment status.
- Add payment reference.
- Add receipt link.
- Mark payment as paid, due, overdue, refunded, waived, or cancelled.
- View minimal student metadata required for billing.

### Finance must be denied from

- Viewing session report content.
- Viewing teacher notes.
- Viewing student educational progress details.
- Viewing reading level unless approved for billing context.
- Viewing memorization progress.
- Viewing teacher internal notes.
- Viewing parent educational notes.
- Viewing admin educational notes.
- Assigning teachers.
- Creating schedules.
- Updating attendance.
- Submitting session reports.
- Viewing audit logs unless explicitly approved.
- Accessing Fawaterk secret keys.
- Seeing or storing card data.

### Required finance test cases

- Finance can view payment for Student A.
- Finance can update payment status.
- Finance can view subscription status.
- Finance cannot view Student A session report.
- Finance cannot view `session_reports.admin_note`.
- Finance cannot view Teacher A internal notes.
- Finance cannot create or update schedule.
- Finance cannot assign Teacher A to Student B.
- Finance cannot access Admin user management.
- Finance cannot access raw Supabase service role key.

---

## 9. Operations Access Tests

### Operations must be allowed to

- Log in to Operations dashboard.
- View leads.
- Update lead status.
- Create parent records from approved leads.
- Create student records.
- Assign teachers to students.
- View teachers and availability.
- Create schedules.
- Update schedules.
- Review sessions.
- Review session reports.
- Review requests.
- Approve or reject operational requests.
- Add internal operational notes.
- View limited payment/subscription status.
- View operational metrics.

### Operations must be denied from

- Accessing payment processor secrets.
- Storing card data.
- Viewing raw card data.
- Updating payment records unless explicitly delegated.
- Changing Admin role.
- Disabling audit logs.
- Deploying production without approval.
- Exposing internal notes to parents or teachers.

### Required operations test cases

- Operations can create Student A.
- Operations can assign Teacher A to Student A.
- Operations can create schedule for Student A.
- Operations can approve Parent A leave request.
- Operations can reject schedule change with user-visible response.
- Operations can view reports for operational follow-up.
- Operations cannot access Fawaterk API secret in frontend.
- Operations cannot bypass RLS by requesting unrelated raw rows.
- Operations changes create audit logs.

---

## 10. Admin Access Tests

### Admin must be allowed to

- View all dashboards.
- Manage users.
- Invite users.
- Change roles.
- Suspend accounts.
- View all students.
- View all teachers.
- View all reports.
- View all schedules.
- View all requests.
- View all subscriptions.
- View all payment tracking records.
- View audit logs.
- Review system health.
- Approve production deployment.

### Admin must still be restricted from

- Storing card data.
- Committing secrets.
- Deleting records without retention/backup policy.
- Sending child data to AI services without explicit consent.
- Deploying production without explicit owner approval.
- Disabling audit logging without owner approval.

### Required admin test cases

- Admin can change role from teacher to operations.
- Admin role change creates audit log.
- Admin can view audit logs.
- Admin can suspend parent account.
- Admin can disable teacher account.
- Admin can view all student records.
- Admin cannot access nonexistent card data because it must not be stored.
- Admin production action requires approval checkpoint.

---

## 11. Row-Level Security Test Scenarios

Supabase RLS tests must verify direct database access rules.

### Parent RLS tests

- Authenticated Parent A can select only Parent A record.
- Parent A can select only Student A.
- Parent A cannot select Student B.
- Parent A can select only Student A sessions.
- Parent A can select only Student A parent-visible reports.
- Parent A cannot select `admin_note` fields through exposed views or RPC responses.
- Parent A cannot update student assignment.

### Teacher RLS tests

- Teacher A can select only Student A.
- Teacher A cannot select Student B.
- Teacher A can select only own sessions.
- Teacher A cannot select Teacher B sessions.
- Teacher A can insert report only for own session.
- Teacher A cannot insert report for unassigned student.
- Teacher A cannot select payment records.

### Finance RLS tests

- Finance can select payments.
- Finance can update payment status.
- Finance can select subscriptions.
- Finance cannot select session report content.
- Finance cannot select teacher internal notes.
- Finance cannot update schedules.

### Operations RLS tests

- Operations can select operational tables.
- Operations can update lead status.
- Operations can assign teachers.
- Operations can update schedules.
- Operations cannot read secrets or processor configuration.
- Operations cannot bypass restricted finance fields unless explicitly allowed.

### Anonymous RLS tests

- Anonymous user cannot read sensitive tables.
- Anonymous user cannot list leads.
- Anonymous user cannot list parents.
- Anonymous user cannot list students.
- Anonymous user can submit public registration only through approved server-side API.
- Anonymous direct table access is denied.

---

## 12. API Authorization Test Scenarios

Every protected API route must test allow and deny cases.

### Required API tests

- Unauthenticated requests return `401`.
- Authenticated but unauthorized requests return `403`.
- Missing record returns safe `404` or `403` without leaking existence.
- Parent requesting another child’s record is denied.
- Teacher requesting unassigned student is denied.
- Finance requesting session report is denied.
- Operations updating payment internals is denied unless explicitly delegated.
- Admin route is denied for all non-admin roles.
- Public registration endpoint accepts valid lead submission.
- Public registration endpoint rejects spam or malformed data.
- All mutating endpoints validate input server-side.
- Restricted fields are filtered from API responses.

### Required API response safety

API errors must not expose:

- SQL details.
- Stack traces.
- Environment variables.
- Record ownership details.
- Internal IDs of unrelated records.
- Payment processor secrets.

---

## 13. Frontend Visibility Test Scenarios

Frontend tests are not security tests, but they reduce user confusion.

### Parent UI

Parent should see:

- Child dashboard.
- Schedule.
- Reports.
- Requests.
- Subscription status.
- Payment link.

Parent should not see:

- Admin dashboard.
- Operations dashboard.
- Finance dashboard.
- Teacher dashboard.
- Internal notes.
- Role management.

### Teacher UI

Teacher should see:

- Assigned students.
- Today’s sessions.
- Weekly schedule.
- Report form.
- Own requests.

Teacher should not see:

- Payments.
- Subscriptions.
- Parent billing data.
- Admin notes.
- Other teachers’ sessions.

### Finance UI

Finance should see:

- Payments.
- Subscriptions.
- Payment status.
- Receipt links.

Finance should not see:

- Session reports.
- Student progress details.
- Teacher report forms.
- Teacher internal notes.

### Operations UI

Operations should see:

- Leads.
- Students.
- Teachers.
- Schedules.
- Sessions.
- Reports.
- Requests.
- Operational status.

Operations should not see:

- Payment processor secrets.
- Card data.
- Production deploy controls unless approved.

### Admin UI

Admin should see:

- Full navigation.
- User management.
- Role management.
- Audit logs.
- Platform settings.

---

## 14. Data Privacy Tests for Child Data

Child data privacy tests must pass before any real child data is imported.

### Required privacy tests

- A parent cannot see another family’s child.
- A parent cannot infer that another child exists.
- A teacher cannot see unassigned child records.
- Finance cannot see child progress reports.
- Public user cannot list students.
- Search results are scoped to the current role.
- Bulk exports are disabled or permission-gated.
- Internal notes are excluded from parent and teacher responses.
- Logs do not contain full child notes.
- Notifications do not include unnecessary child details.
- Screenshots used for documentation contain fictional data only.

### Sensitive fields that must be protected

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

---

## 15. Payment Safety Tests

Payment testing must confirm that the platform tracks payment status only.

### Must pass

- No database table includes card number field.
- No database table includes CVV field.
- No database table includes full PAN field.
- Payment link is external.
- Payment status can be updated by Finance.
- Parent can view own payment link.
- Teacher cannot view payment data.
- Operations can view limited payment status only.
- Fawaterk API key is server-only.
- Fawaterk webhook secret is server-only.
- Frontend cannot access payment processor secrets.
- Logs do not include card data or payment secrets.

---

## 16. Audit Logging Tests

Audit logging must be tested before real data is used.

### Must log

- Login success.
- Login failure.
- Password reset request.
- Role change.
- User invitation.
- Student profile view by staff.
- Student profile update.
- Teacher assignment change.
- Schedule creation.
- Schedule update.
- Session status change.
- Session report creation.
- Session report update.
- Request approval.
- Request rejection.
- Payment status update.
- Subscription status update.
- Data export, if exports are later implemented.

### Must not log

- Passwords.
- Access tokens.
- Refresh tokens.
- API secrets.
- Full payment card data.
- CVV.
- Unsafe full child notes.
- Raw WhatsApp content containing sensitive child data.

---

## 17. Public Registration Form Tests

The public registration form is the only unauthenticated workflow.

### Valid submission tests

- Valid parent name accepted.
- Valid email accepted.
- Valid WhatsApp accepted.
- Child name accepted.
- Child age between 4 and 14 accepted.
- Requested service accepted.
- Privacy policy consent required.
- Lead created with status `new`.
- Duplicate detection works.

### Invalid submission tests

- Missing parent name rejected.
- Invalid email rejected.
- Missing WhatsApp rejected.
- Child age below 4 rejected.
- Child age above 14 rejected.
- Missing privacy consent rejected.
- Excessive submissions rate-limited.
- Bot-like submissions rejected.
- Malformed payload rejected.
- Direct lead listing denied.

### Security tests

- Public form cannot set lead status manually.
- Public form cannot assign staff user.
- Public form cannot create parent account directly.
- Public form cannot inject admin notes.
- Public form cannot bypass rate limits.

---

## 18. Session Report Visibility Tests

### Teacher report creation

- Teacher can submit report for own session.
- Teacher cannot submit report for another teacher’s session.
- Teacher cannot submit duplicate report for same session.
- Teacher can edit report within edit window.
- Teacher cannot edit after edit window unless approved.

### Parent visibility

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
- Internal intervention reason unless parent-safe.
- Other students’ reports.
- Other teacher internal notes.

### Finance visibility

Finance cannot see:

- Session report detail.
- Performance level.
- Engagement level.
- Homework.
- Parent note.
- Admin note.

### Operations/Admin visibility

- Operations can view full report for follow-up.
- Admin can view full report.
- Intervention-needed reports appear in operational follow-up list.

---

## 19. Request Workflow Tests

### Parent requests

Parent can create:

- Parent leave request.
- Makeup session request.
- Schedule change request.
- Pause subscription request.
- Resume subscription request.
- Change session count request.
- Complaint.
- General inquiry.

Parent can view:

- Own request status.
- User-visible response.
- Approved alternative session time.

Parent cannot view:

- Internal admin notes.
- Other family requests.

### Teacher requests

Teacher can create:

- Teacher leave request.
- Makeup request.
- Schedule change request.
- General inquiry.

Teacher can view:

- Own requests.
- Requests related to own sessions when appropriate.

Teacher cannot view:

- Parent complaints unrelated to them.
- Payment-related requests.
- Internal admin notes.

### Operations requests

Operations can:

- Review new requests.
- Mark request as under review.
- Approve request.
- Reject request.
- Schedule makeup session.
- Add internal notes.
- Add user-visible response.
- Close request.

### Finance requests

Finance can:

- View payment-related requests.
- Update payment-related status.
- Add finance response.

Finance cannot:

- Review educational complaints.
- View teacher notes.
- View session report internals.

---

## 20. Migration and Seed Data Tests

### Seed data tests

- Seed data contains fictional parents only.
- Seed data contains fictional students only.
- Seed data contains fictional teachers only.
- Seed data contains fake WhatsApp numbers.
- Seed data contains fake payment references.
- Seed data contains fake report content.
- No real data appears in commits.

### Migration readiness tests

Before real data import:

- Backups are configured.
- RLS policies are enabled.
- Permission tests pass.
- Parent isolation tests pass.
- Teacher isolation tests pass.
- Finance restriction tests pass.
- Internal note visibility tests pass.
- Audit logs are working.
- Import is tested in staging.
- Owner approval is recorded.

---

## 21. Production Readiness Checklist

Production may not begin until all items are approved.

- [ ] All documentation reviewed.
- [ ] Architecture approved.
- [ ] Database schema approved.
- [ ] Permissions approved.
- [ ] Testing strategy approved.
- [ ] Supabase project configured.
- [ ] RLS policies implemented and tested.
- [ ] Server-side authorization implemented and tested.
- [ ] No real child data in seed/test data.
- [ ] No card data stored.
- [ ] Payment secrets are server-only.
- [ ] Fawaterk integration tested in sandbox.
- [ ] Email/notification provider tested.
- [ ] Backups configured.
- [ ] Rollback plan documented.
- [ ] Audit logging working.
- [ ] Public website remains untouched.
- [ ] app.ratel-quran.com configured.
- [ ] Owner approval granted for production deployment.

---

## 22. Common Failures to Prevent

The implementation must prevent:

- RLS disabled in production.
- API route returning unfiltered data.
- Parent accessing another child through URL manipulation.
- Teacher accessing unassigned student through ID guessing.
- Finance accessing reports through direct API call.
- Hidden frontend fields still returned by API.
- Internal notes included in parent response.
- Payment processor keys exposed to browser.
- Real child data committed in seed file.
- Logs containing private child notes.
- Public form creating privileged records.
- Migration importing data before permissions are tested.
- Production deploy without owner approval.

---

## 23. Non-Goals

This document does not:

- Create test files.
- Implement automated tests.
- Create Supabase policies.
- Create database migrations.
- Create a Next.js project.
- Add testing dependencies.
- Add CI/CD workflow files.
- Deploy staging or production.
- Import real data.

This document only defines the testing strategy that must be approved before implementation.

---

## 24. Owner Approval Checklist

Before implementation, the owner must approve:

- [ ] Testing strategy.
- [ ] Permission test matrix.
- [ ] Parent access tests.
- [ ] Teacher access tests.
- [ ] Finance access tests.
- [ ] Operations access tests.
- [ ] Admin access tests.
- [ ] RLS test scenarios.
- [ ] API authorization test scenarios.
- [ ] Data privacy tests.
- [ ] Payment safety tests.
- [ ] Audit logging tests.
- [ ] Public registration form tests.
- [ ] Session report visibility tests.
- [ ] Request workflow tests.
- [ ] Migration and seed data tests.
- [ ] Production readiness checklist.

---

**Status**: Draft — awaiting owner approval.  
**Next Step**: Review and approve before creating test files, RLS policies, migrations, or application code.
