جاهز. الصق النص التالي كاملًا داخل محرر GitHub في ملف `DATABASE_SCHEMA.md`، ثم اعمل Commit بعنوان:

```text
Add database schema documentation
```

```md
# DATABASE_SCHEMA.md: Rattel Operational Platform

**Document Version**: 1.0  
**Last Updated**: 21 July 2026  
**Status**: Draft — awaiting owner approval  
**Scope**: Logical PostgreSQL/Supabase schema documentation only. No database has been created and no migrations have been executed.

---

## 1. Database Overview

The Rattel operational platform will use **PostgreSQL through Supabase** as the primary database layer.

The database supports the operational needs of a child-safe Arabic RTL Quran education platform, including:

- Family and parent records.
- Student records.
- Teacher profiles and availability.
- Lead registration and assessment.
- Student enrollment and scheduling.
- Generated lesson sessions.
- Teacher session reports.
- Parent and teacher requests.
- Subscriptions and payment tracking.
- Notifications.
- Audit logs.

The schema must protect children's data through:

1. Server-side authorization.
2. Supabase Row-Level Security.
3. Clear role-based access boundaries.
4. Data minimization.
5. Audit logging for sensitive operations.

This document is not an executable migration. It defines the logical schema that should be reviewed before implementation.

---

## 2. Entity Relationship Summary

High-level relationships:

- One `profile` represents one authenticated platform user.
- A `profile` may be linked to a `parent`, `teacher`, or internal staff role.
- One `parent` may have many `students`.
- One `teacher` may teach many `students`.
- One `student` may have one active `enrollment`.
- One `enrollment` links a student, teacher, service path, and operational status.
- One `teacher` has many `teacher_availability` records.
- One `schedule` links one student and one teacher in a recurring weekly slot.
- One `schedule` generates many `sessions`.
- One `session` may have one `session_report`.
- One `student` may have many `subscriptions`.
- One `subscription` may have many `payments`.
- One `request` may be linked to a student, teacher, schedule, session, or subscription.
- `audit_logs` track sensitive actions across the system.

---

## 3. Enums and Allowed Status Values

Use PostgreSQL enums or constrained text values. Final implementation may choose either, but allowed values must remain controlled.

### profile_role

- `admin`
- `operations`
- `finance`
- `teacher`
- `parent`

### account_status

- `active`
- `invited`
- `suspended`
- `disabled`

### lead_status

- `new`
- `contacted`
- `qualified`
- `assessment_scheduled`
- `assessed`
- `plan_proposed`
- `awaiting_payment`
- `enrolled`
- `no_response`
- `lost`

### student_status

- `pending_placement`
- `active`
- `paused`
- `at_risk`
- `withdrawn`
- `completed`

### gender

- `male`
- `female`
- `not_specified`

### service_path

- `quran_memorization`
- `recitation_correction`
- `revision_and_retention`
- `beginner_quranic_reading`
- `individual_follow_up`

### teacher_status

- `active`
- `inactive`
- `on_leave`
- `suspended`

### schedule_status

- `active`
- `paused`
- `ended`
- `cancelled`

### session_status

- `scheduled`
- `completed`
- `student_absent`
- `teacher_absent`
- `cancelled`
- `rescheduled`
- `makeup_required`
- `makeup_completed`

### attendance_status

- `present`
- `student_absent`
- `teacher_absent`
- `excused`
- `cancelled`

### performance_level

- `excellent`
- `good`
- `needs_follow_up`

### engagement_level

- `excellent`
- `good`
- `low`

### request_type

- `parent_leave`
- `teacher_leave`
- `makeup_session`
- `schedule_change`
- `pause_subscription`
- `resume_subscription`
- `change_session_count`
- `complaint`
- `general_inquiry`

### request_status

- `new`
- `under_review`
- `approved`
- `rejected`
- `scheduled`
- `completed`
- `cancelled`

### subscription_status

- `active`
- `pending_payment`
- `paused`
- `cancelled`
- `expired`
- `completed`

### payment_status

- `upcoming`
- `due`
- `paid`
- `overdue`
- `waived`
- `refunded`
- `cancelled`

### notification_status

- `pending`
- `sent`
- `failed`
- `read`

### notification_channel

- `email`
- `whatsapp`
- `in_app`

---

## 4. Tables

---

## 4.1 profiles

Represents the authenticated user profile linked to Supabase Auth.

### Columns

| Column | Type | Required | Notes |
|---|---:|---:|---|
| id | uuid | yes | Primary key. Should match Supabase Auth user id where applicable. |
| email | text | yes | Unique user email. |
| full_name | text | yes | Display name. |
| role | profile_role | yes | User role. |
| phone | text | no | Optional phone number. |
| whatsapp | text | no | Optional WhatsApp number. |
| preferred_language | text | no | Default `ar`. |
| timezone | text | no | IANA timezone, for example `Europe/Istanbul`. |
| account_status | account_status | yes | Default `invited` or `active`. |
| last_login_at | timestamptz | no | Updated after successful login. |
| created_at | timestamptz | yes | Default `now()`. |
| updated_at | timestamptz | yes | Default `now()`. |
| created_by | uuid | no | References `profiles.id`. |
| updated_by | uuid | no | References `profiles.id`. |

### Keys

- Primary key: `id`
- Unique: `email`

### Recommended Indexes

- `idx_profiles_role`
- `idx_profiles_account_status`
- `idx_profiles_email`

---

## 4.2 parents

Represents a parent or guardian account.

### Columns

| Column | Type | Required | Notes |
|---|---:|---:|---|
| id | uuid | yes | Primary key. |
| profile_id | uuid | yes | References `profiles.id`. |
| name | text | yes | Parent name. |
| email | text | yes | Parent email. |
| phone | text | no | Phone number. |
| whatsapp | text | yes | WhatsApp number. |
| country | text | no | Country of residence. |
| timezone | text | yes | Parent timezone. |
| preferred_language | text | yes | Default `ar`. |
| account_status | account_status | yes | Parent account status. |
| notes_internal | text | no | Internal admin-only notes. |
| created_at | timestamptz | yes | Default `now()`. |
| updated_at | timestamptz | yes | Default `now()`. |
| created_by | uuid | no | References `profiles.id`. |
| updated_by | uuid | no | References `profiles.id`. |

### Keys

- Primary key: `id`
- Foreign key: `profile_id → profiles.id`
- Unique: `profile_id`

### Recommended Indexes

- `idx_parents_profile_id`
- `idx_parents_whatsapp`
- `idx_parents_email`
- `idx_parents_account_status`

---

## 4.3 students

Represents each child enrolled or pending placement.

### Columns

| Column | Type | Required | Notes |
|---|---:|---:|---|
| id | uuid | yes | Primary key. |
| parent_id | uuid | yes | References `parents.id`. |
| teacher_id | uuid | no | References `teachers.id`; nullable before placement. |
| name | text | yes | Student name. |
| age | integer | yes | Expected 4–14. |
| gender | gender | yes | Student gender. |
| country | text | no | Usually inherited from parent. |
| timezone | text | yes | Student timezone, usually inherited from parent. |
| reading_level | text | no | Current Quran reading level. |
| memorization_level | text | no | Current memorization level. |
| service_path | service_path | yes | Chosen learning path. |
| student_status | student_status | yes | Default `pending_placement`. |
| start_date | date | no | First active date. |
| weekly_sessions_count | integer | no | Number of weekly sessions. |
| session_duration_minutes | integer | no | Default depends on package. |
| current_goal | text | no | Current learning goal. |
| risk_level | text | no | Example: `low`, `medium`, `high`. |
| admin_notes | text | no | Internal notes only. Not visible to parent or teacher unless explicitly allowed. |
| last_follow_up_at | timestamptz | no | Last operational follow-up. |
| created_at | timestamptz | yes | Default `now()`. |
| updated_at | timestamptz | yes | Default `now()`. |
| created_by | uuid | no | References `profiles.id`. |
| updated_by | uuid | no | References `profiles.id`. |

### Keys

- Primary key: `id`
- Foreign key: `parent_id → parents.id`
- Foreign key: `teacher_id → teachers.id`

### Recommended Indexes

- `idx_students_parent_id`
- `idx_students_teacher_id`
- `idx_students_status`
- `idx_students_service_path`
- `idx_students_risk_level`

### Privacy Notes

- `admin_notes` must never be returned to parent users.
- Teachers should see only assigned students.
- Parents should see only their own children.

---

## 4.4 teachers

Represents teacher profiles and capacity information.

### Columns

| Column | Type | Required | Notes |
|---|---:|---:|---|
| id | uuid | yes | Primary key. |
| profile_id | uuid | yes | References `profiles.id`. |
| name | text | yes | Teacher name. |
| email | text | yes | Teacher email. |
| phone | text | no | Phone number. |
| gender | gender | yes | Teacher gender. |
| country | text | no | Country of residence. |
| timezone | text | yes | Teacher timezone. |
| specializations | text[] | no | Example: memorization, tajweed, beginner reading. |
| suitable_age_groups | text[] | no | Example: 4–6, 7–10, 11–14. |
| teacher_status | teacher_status | yes | Default `active`. |
| max_students | integer | yes | Teacher capacity. |
| active_students_count | integer | yes | Cached or calculated count. |
| available_seats | integer | yes | Calculated as `max_students - active_students_count`. |
| utilization_rate | numeric | yes | Calculated as `active_students_count / max_students`. |
| weekly_available_hours | numeric | no | Available weekly hours. |
| admin_rating | numeric | no | Internal rating. |
| internal_notes | text | no | Internal admin-only notes. |
| created_at | timestamptz | yes | Default `now()`. |
| updated_at | timestamptz | yes | Default `now()`. |
| created_by | uuid | no | References `profiles.id`. |
| updated_by | uuid | no | References `profiles.id`. |

### Keys

- Primary key: `id`
- Foreign key: `profile_id → profiles.id`
- Unique: `profile_id`

### Recommended Indexes

- `idx_teachers_profile_id`
- `idx_teachers_status`
- `idx_teachers_timezone`
- `idx_teachers_utilization_rate`

### Operational Notes

- Alert when `utilization_rate >= 0.80`.
- Alert when `available_seats <= 0`.
- `available_seats` and `utilization_rate` may be calculated dynamically instead of stored.

---

## 4.5 leads

Represents public registration form submissions.

### Columns

| Column | Type | Required | Notes |
|---|---:|---:|---|
| id | uuid | yes | Primary key. |
| parent_name | text | yes | Parent name from registration form. |
| whatsapp | text | yes | WhatsApp number. |
| email | text | yes | Email address. |
| country | text | no | Country. |
| timezone | text | yes | Family timezone. |
| child_name | text | yes | Child name. |
| child_age | integer | yes | Expected 4–14. |
| child_gender | gender | yes | Child gender. |
| reading_level | text | no | Reading level. |
| memorization_level | text | no | Current memorization. |
| requested_service | service_path | yes | Requested service path. |
| suitable_days | text[] | no | Suitable days. |
| suitable_times | text[] | no | Suitable times. |
| referral_source | text | no | How family heard about Rattel. |
| additional_notes | text | no | Optional parent notes. |
| privacy_policy_accepted | boolean | yes | Must be true. |
| lead_status | lead_status | yes | Default `new`. |
| assigned_to | uuid | no | Staff profile assigned to follow up. |
| duplicate_key | text | no | Used for duplicate detection. |
| created_at | timestamptz | yes | Default `now()`. |
| updated_at | timestamptz | yes | Default `now()`. |
| created_by | uuid | no | Usually null for public form. |
| updated_by | uuid | no | References `profiles.id`. |

### Keys

- Primary key: `id`
- Foreign key: `assigned_to → profiles.id`

### Recommended Indexes

- `idx_leads_status`
- `idx_leads_email`
- `idx_leads_whatsapp`
- `idx_leads_created_at`
- `idx_leads_duplicate_key`

### Security Notes

- Public insert only through server-side API.
- Rate limiting required.
- Duplicate detection by email/WhatsApp within a defined time window.

---

## 4.6 assessments

Represents assessment or level-check records before enrollment.

### Columns

| Column | Type | Required | Notes |
|---|---:|---:|---|
| id | uuid | yes | Primary key. |
| lead_id | uuid | no | References `leads.id`. |
| student_id | uuid | no | References `students.id` if already created. |
| teacher_id | uuid | no | References `teachers.id`. |
| scheduled_at | timestamptz | no | Assessment time. |
| completed_at | timestamptz | no | Completion time. |
| reading_assessment | text | no | Reading assessment notes. |
| memorization_assessment | text | no | Memorization assessment notes. |
| recommended_service | service_path | no | Recommended path. |
| recommended_weekly_sessions | integer | no | Suggested weekly count. |
| assessment_notes | text | no | Internal assessment notes. |
| parent_summary | text | no | Parent-safe summary. |
| created_at | timestamptz | yes | Default `now()`. |
| updated_at | timestamptz | yes | Default `now()`. |
| created_by | uuid | no | References `profiles.id`. |
| updated_by | uuid | no | References `profiles.id`. |

### Keys

- Primary key: `id`
- Foreign key: `lead_id → leads.id`
- Foreign key: `student_id → students.id`
- Foreign key: `teacher_id → teachers.id`

### Recommended Indexes

- `idx_assessments_lead_id`
- `idx_assessments_student_id`
- `idx_assessments_teacher_id`
- `idx_assessments_scheduled_at`

---

## 4.7 enrollments

Represents active or historical enrollment relationships.

### Columns

| Column | Type | Required | Notes |
|---|---:|---:|---|
| id | uuid | yes | Primary key. |
| student_id | uuid | yes | References `students.id`. |
| teacher_id | uuid | yes | References `teachers.id`. |
| service_path | service_path | yes | Active service path. |
| enrollment_status | text | yes | Example: active, paused, ended. |
| start_date | date | yes | Enrollment start date. |
| end_date | date | no | Enrollment end date. |
| weekly_sessions_count | integer | yes | Weekly sessions. |
| session_duration_minutes | integer | yes | Session duration. |
| notes_internal | text | no | Admin-only notes. |
| created_at | timestamptz | yes | Default `now()`. |
| updated_at | timestamptz | yes | Default `now()`. |
| created_by | uuid | no | References `profiles.id`. |
| updated_by | uuid | no | References `profiles.id`. |

### Keys

- Primary key: `id`
- Foreign key: `student_id → students.id`
- Foreign key: `teacher_id → teachers.id`

### Recommended Indexes

- `idx_enrollments_student_id`
- `idx_enrollments_teacher_id`
- `idx_enrollments_status`
- `idx_enrollments_start_date`

---

## 4.8 teacher_availability

Represents recurring available slots for teachers.

### Columns

| Column | Type | Required | Notes |
|---|---:|---:|---|
| id | uuid | yes | Primary key. |
| teacher_id | uuid | yes | References `teachers.id`. |
| day_of_week | integer | yes | 0–6 or 1–7 depending on chosen convention. |
| start_time | time | yes | Local start time. |
| end_time | time | yes | Local end time. |
| timezone | text | yes | Teacher timezone. |
| is_recurring | boolean | yes | Default true. |
| effective_from | date | no | Availability start date. |
| effective_to | date | no | Availability end date. |
| notes | text | no | Internal notes. |
| created_at | timestamptz | yes | Default `now()`. |
| updated_at | timestamptz | yes | Default `now()`. |
| created_by | uuid | no | References `profiles.id`. |
| updated_by | uuid | no | References `profiles.id`. |

### Keys

- Primary key: `id`
- Foreign key: `teacher_id → teachers.id`

### Recommended Indexes

- `idx_teacher_availability_teacher_id`
- `idx_teacher_availability_day_time`

---

## 4.9 schedules

Represents recurring scheduled lessons.

### Columns

| Column | Type | Required | Notes |
|---|---:|---:|---|
| id | uuid | yes | Primary key. |
| student_id | uuid | yes | References `students.id`. |
| teacher_id | uuid | yes | References `teachers.id`. |
| enrollment_id | uuid | no | References `enrollments.id`. |
| day_of_week | integer | yes | Recurring day. |
| start_time | time | yes | Local start time. |
| end_time | time | yes | Local end time. |
| timezone | text | yes | Schedule timezone. |
| meeting_link | text | no | External Zoom/Meet link. |
| start_date | date | yes | Schedule start. |
| end_date | date | no | Schedule end. |
| schedule_status | schedule_status | yes | Default `active`. |
| pause_reason | text | no | Reason for pause if paused. |
| created_at | timestamptz | yes | Default `now()`. |
| updated_at | timestamptz | yes | Default `now()`. |
| created_by | uuid | no | References `profiles.id`. |
| updated_by | uuid | no | References `profiles.id`. |

### Keys

- Primary key: `id`
- Foreign key: `student_id → students.id`
- Foreign key: `teacher_id → teachers.id`
- Foreign key: `enrollment_id → enrollments.id`

### Recommended Indexes

- `idx_schedules_student_id`
- `idx_schedules_teacher_id`
- `idx_schedules_status`
- `idx_schedules_day_time`
- `idx_schedules_start_date`

### Conflict Rule

Prevent overlapping active schedules for the same teacher on the same day and time range.

---

## 4.10 sessions

Represents concrete lesson instances generated from schedules.

### Columns

| Column | Type | Required | Notes |
|---|---:|---:|---|
| id | uuid | yes | Primary key. |
| schedule_id | uuid | yes | References `schedules.id`. |
| student_id | uuid | yes | References `students.id`. |
| teacher_id | uuid | yes | References `teachers.id`. |
| session_date | date | yes | Date of the session. |
| starts_at | timestamptz | yes | Exact start timestamp. |
| ends_at | timestamptz | yes | Exact end timestamp. |
| timezone | text | yes | Display timezone. |
| meeting_link | text | no | External meeting link. |
| session_status | session_status | yes | Default `scheduled`. |
| rescheduled_from_session_id | uuid | no | References `sessions.id`. |
| cancellation_reason | text | no | Reason if cancelled. |
| created_at | timestamptz | yes | Default `now()`. |
| updated_at | timestamptz | yes | Default `now()`. |
| created_by | uuid | no | References `profiles.id`. |
| updated_by | uuid | no | References `profiles.id`. |

### Keys

- Primary key: `id`
- Foreign key: `schedule_id → schedules.id`
- Foreign key: `student_id → students.id`
- Foreign key: `teacher_id → teachers.id`
- Foreign key: `rescheduled_from_session_id → sessions.id`

### Recommended Indexes

- `idx_sessions_schedule_id`
- `idx_sessions_student_id`
- `idx_sessions_teacher_id`
- `idx_sessions_starts_at`
- `idx_sessions_status`

---

## 4.11 session_reports

Represents teacher reports after each session.

### Columns

| Column | Type | Required | Notes |
|---|---:|---:|---|
| id | uuid | yes | Primary key. |
| session_id | uuid | yes | References `sessions.id`. |
| student_id | uuid | yes | References `students.id`. |
| teacher_id | uuid | yes | References `teachers.id`. |
| report_date | date | yes | Report date. |
| attendance_status | attendance_status | yes | Attendance result. |
| reviewed_material | text | no | What was reviewed. |
| new_lesson | text | no | New lesson or memorization. |
| performance_level | performance_level | no | Student performance. |
| engagement_level | engagement_level | no | Student engagement. |
| homework | text | no | Parent-visible homework. |
| parent_note | text | no | Parent-visible note. |
| admin_note | text | no | Internal note only. |
| intervention_needed | boolean | yes | Default false. |
| intervention_reason | text | no | Required if intervention needed. |
| editable_until | timestamptz | no | Teacher edit cutoff. |
| created_at | timestamptz | yes | Default `now()`. |
| updated_at | timestamptz | yes | Default `now()`. |
| created_by | uuid | no | References `profiles.id`. |
| updated_by | uuid | no | References `profiles.id`. |

### Keys

- Primary key: `id`
- Foreign key: `session_id → sessions.id`
- Foreign key: `student_id → students.id`
- Foreign key: `teacher_id → teachers.id`
- Unique: `session_id`

### Recommended Indexes

- `idx_session_reports_session_id`
- `idx_session_reports_student_id`
- `idx_session_reports_teacher_id`
- `idx_session_reports_intervention_needed`
- `idx_session_reports_created_at`

### Privacy Notes

- Parents may see `reviewed_material`, `new_lesson`, `performance_level`, `engagement_level`, `homework`, and `parent_note`.
- Parents must never see `admin_note`.
- Finance must not access report details.
- Teachers must see only reports for their assigned students.

---

## 4.12 subscriptions

Represents student subscription tracking.

### Columns

| Column | Type | Required | Notes |
|---|---:|---:|---|
| id | uuid | yes | Primary key. |
| student_id | uuid | yes | References `students.id`. |
| package_name | text | yes | Package name. |
| price | numeric | yes | Subscription price. |
| currency | text | yes | Example: USD, EUR, TRY. |
| session_count | integer | yes | Sessions included. |
| start_date | date | yes | Subscription start. |
| renewal_date | date | no | Renewal date. |
| subscription_status | subscription_status | yes | Default `pending_payment`. |
| discount_amount | numeric | no | Optional discount. |
| notes | text | no | Finance/admin notes. |
| created_at | timestamptz | yes | Default `now()`. |
| updated_at | timestamptz | yes | Default `now()`. |
| created_by | uuid | no | References `profiles.id`. |
| updated_by | uuid | no | References `profiles.id`. |

### Keys

- Primary key: `id`
- Foreign key: `student_id → students.id`

### Recommended Indexes

- `idx_subscriptions_student_id`
- `idx_subscriptions_status`
- `idx_subscriptions_renewal_date`

---

## 4.13 payments

Tracks payment status without storing card data.

### Columns

| Column | Type | Required | Notes |
|---|---:|---:|---|
| id | uuid | yes | Primary key. |
| subscription_id | uuid | yes | References `subscriptions.id`. |
| student_id | uuid | yes | References `students.id`. |
| amount | numeric | yes | Payment amount. |
| currency | text | yes | Currency. |
| due_date | date | yes | Due date. |
| paid_date | date | no | Payment date. |
| payment_status | payment_status | yes | Default `upcoming`. |
| payment_method | text | no | Example: Fawaterk, bank transfer. |
| external_payment_link | text | no | Fawaterk payment link. |
| external_reference | text | no | External processor reference. |
| receipt_link | text | no | External receipt link. |
| notes_internal | text | no | Internal finance notes. |
| created_at | timestamptz | yes | Default `now()`. |
| updated_at | timestamptz | yes | Default `now()`. |
| created_by | uuid | no | References `profiles.id`. |
| updated_by | uuid | no | References `profiles.id`. |

### Keys

- Primary key: `id`
- Foreign key: `subscription_id → subscriptions.id`
- Foreign key: `student_id → students.id`

### Recommended Indexes

- `idx_payments_subscription_id`
- `idx_payments_student_id`
- `idx_payments_status`
- `idx_payments_due_date`
- `idx_payments_external_reference`

### Payment Safety Rules

- Never store card number.
- Never store CVV.
- Never store full PAN.
- Store only external payment links, references, statuses, and receipt links.

---

## 4.14 requests

Unified request tracking for parents, teachers, and operations.

### Columns

| Column | Type | Required | Notes |
|---|---:|---:|---|
| id | uuid | yes | Primary key. |
| requester_profile_id | uuid | yes | References `profiles.id`. |
| requester_role | profile_role | yes | Role of requester. |
| student_id | uuid | no | References `students.id`. |
| teacher_id | uuid | no | References `teachers.id`. |
| session_id | uuid | no | References `sessions.id`. |
| schedule_id | uuid | no | References `schedules.id`. |
| request_type | request_type | yes | Request category. |
| reason | text | yes | User-provided reason. |
| requested_date | date | no | Requested date. |
| suggested_alt_time | timestamptz | no | Suggested alternative. |
| request_status | request_status | yes | Default `new`. |
| admin_notes | text | no | Internal notes. |
| user_visible_response | text | no | Response shown to requester. |
| closed_at | timestamptz | no | Closure timestamp. |
| created_at | timestamptz | yes | Default `now()`. |
| updated_at | timestamptz | yes | Default `now()`. |
| created_by | uuid | no | References `profiles.id`. |
| updated_by | uuid | no | References `profiles.id`. |

### Keys

- Primary key: `id`
- Foreign key: `requester_profile_id → profiles.id`
- Foreign key: `student_id → students.id`
- Foreign key: `teacher_id → teachers.id`
- Foreign key: `session_id → sessions.id`
- Foreign key: `schedule_id → schedules.id`

### Recommended Indexes

- `idx_requests_requester_profile_id`
- `idx_requests_student_id`
- `idx_requests_teacher_id`
- `idx_requests_status`
- `idx_requests_type`
- `idx_requests_created_at`

### Privacy Notes

- Requesters see their own requests.
- Parents see only requests related to their own children.
- Teachers see only requests related to themselves or assigned students.
- Admin and Operations can review all requests.

---

## 4.15 notifications

Tracks internal and external notifications.

### Columns

| Column | Type | Required | Notes |
|---|---:|---:|---|
| id | uuid | yes | Primary key. |
| recipient_profile_id | uuid | yes | References `profiles.id`. |
| channel | notification_channel | yes | Email, WhatsApp, or in-app. |
| notification_status | notification_status | yes | Default `pending`. |
| title | text | yes | Notification title. |
| body | text | yes | Notification body. |
| related_table | text | no | Related table name. |
| related_record_id | uuid | no | Related record id. |
| sent_at | timestamptz | no | Sent time. |
| read_at | timestamptz | no | Read time. |
| failure_reason | text | no | Failure reason. |
| created_at | timestamptz | yes | Default `now()`. |
| updated_at | timestamptz | yes | Default `now()`. |

### Keys

- Primary key: `id`
- Foreign key: `recipient_profile_id → profiles.id`

### Recommended Indexes

- `idx_notifications_recipient_profile_id`
- `idx_notifications_status`
- `idx_notifications_channel`
- `idx_notifications_created_at`

### Privacy Notes

- Do not include sensitive child details in external notification bodies.
- Email and WhatsApp notifications should use minimal data.

---

## 4.16 audit_logs

Tracks sensitive access and changes.

### Columns

| Column | Type | Required | Notes |
|---|---:|---:|---|
| id | uuid | yes | Primary key. |
| actor_profile_id | uuid | no | References `profiles.id`; nullable for system actions. |
| actor_role | profile_role | no | Actor role at time of action. |
| action | text | yes | Example: login, view_student, update_payment. |
| table_name | text | no | Affected table. |
| record_id | uuid | no | Affected record. |
| old_values | jsonb | no | Previous values for updates. |
| new_values | jsonb | no | New values for updates. |
| ip_address | inet | no | Source IP where applicable. |
| user_agent | text | no | User agent. |
| metadata | jsonb | no | Additional context. |
| created_at | timestamptz | yes | Default `now()`. |

### Keys

- Primary key: `id`
- Foreign key: `actor_profile_id → profiles.id`

### Recommended Indexes

- `idx_audit_logs_actor_profile_id`
- `idx_audit_logs_action`
- `idx_audit_logs_table_record`
- `idx_audit_logs_created_at`

### Logging Requirements

Log at minimum:

- Login success and failure.
- Password reset request.
- User role changes.
- Student record access.
- Student record update.
- Teacher assignment changes.
- Schedule creation, update, cancellation.
- Session report creation and update.
- Payment status update.
- Subscription update.
- Request approval or rejection.
- Export actions, if exports are later added.

---

## 5. Row-Level Security Strategy

RLS is required on all tables containing user, child, family, session, report, payment, or request data.

### General Rules

- Enable RLS on all application tables.
- Deny by default.
- Grant access only through explicit policies.
- Use Supabase Auth user id as the trusted identity source.
- Do not rely on frontend-hidden UI elements for authorization.
- Server-side authorization must also run before database access.

### Role Resolution

The system should resolve the current user role from `profiles.role`.

Recommended helper concept:

- `current_profile_id`
- `current_profile_role`
- `current_parent_id`
- `current_teacher_id`

These may be implemented as SQL helper functions later, but this document does not create them.

---

## 6. Role-Based Access Rules Per Table

| Table | Admin | Operations | Finance | Teacher | Parent |
|---|---|---|---|---|---|
| profiles | full | limited staff/user admin | own profile only | own profile only | own profile only |
| parents | full | full | limited metadata | none | own record only |
| students | full | full | limited metadata | assigned only | own children only |
| teachers | full | full | none | own record only | limited assigned teacher display |
| leads | full | full | none | assigned assessments only | create public lead only |
| assessments | full | full | none | assigned only | parent-safe summary only |
| enrollments | full | full | limited status only | assigned only | own children only |
| teacher_availability | full | full | none | own only | none |
| schedules | full | full | none | own teacher schedule only | own children only |
| sessions | full | full | none | own sessions only | own children only |
| session_reports | full | full | none | own assigned reports only | own children reports, excluding admin notes |
| subscriptions | full | limited status only | full | none | own children status only |
| payments | full | limited status only | full | none | own children payment status and links only |
| requests | full | full | payment-related only | own requests only | own requests only |
| notifications | full | operational visibility | finance-related only | own notifications only | own notifications only |
| audit_logs | full | limited operational logs | none | none | none |

---

## 7. Recommended Indexes Summary

Recommended high-priority indexes:

- `profiles(role, account_status)`
- `parents(profile_id)`
- `parents(email)`
- `parents(whatsapp)`
- `students(parent_id)`
- `students(teacher_id)`
- `students(student_status)`
- `students(risk_level)`
- `teachers(profile_id)`
- `teachers(teacher_status)`
- `teachers(utilization_rate)`
- `leads(lead_status)`
- `leads(email)`
- `leads(whatsapp)`
- `leads(created_at)`
- `assessments(lead_id)`
- `assessments(student_id)`
- `enrollments(student_id)`
- `enrollments(teacher_id)`
- `teacher_availability(teacher_id, day_of_week)`
- `schedules(teacher_id, day_of_week, start_time, end_time)`
- `schedules(student_id)`
- `sessions(teacher_id, starts_at)`
- `sessions(student_id, starts_at)`
- `sessions(session_status)`
- `session_reports(session_id)`
- `session_reports(student_id)`
- `session_reports(teacher_id)`
- `subscriptions(student_id)`
- `subscriptions(subscription_status)`
- `payments(subscription_id)`
- `payments(payment_status)`
- `payments(due_date)`
- `requests(request_status)`
- `requests(request_type)`
- `requests(requester_profile_id)`
- `notifications(recipient_profile_id, notification_status)`
- `audit_logs(actor_profile_id)`
- `audit_logs(table_name, record_id)`
- `audit_logs(created_at)`

---

## 8. Data Privacy Constraints for Child Data

The platform processes personal data related to children. The schema must enforce strict boundaries.

### Required Constraints

- Child records must always be linked to a parent.
- Teachers may access only students assigned to them.
- Parents may access only their own children.
- Finance may access payment/subscription records but not educational notes or reports.
- Internal admin notes must never be visible to parents.
- Teacher internal notes must not be visible to parents unless explicitly placed in a parent-safe field.
- Public registration data must be rate-limited and validated server-side.
- Child data must never be placed in logs, seeds, screenshots, fixtures, or analytics without explicit approval.
- No third-party AI service may receive child data without explicit consent.

### Sensitive Fields

Sensitive fields include:

- `students.admin_notes`
- `session_reports.admin_note`
- `assessments.assessment_notes`
- `requests.admin_notes`
- `payments.notes_internal`
- `parents.notes_internal`
- `teachers.internal_notes`

These fields require stricter read policies and must be excluded from non-admin API responses.

---

## 9. Audit Logging Requirements

Audit logging must be implemented before real child data is imported.

### Must Log

- Authentication events.
- Role changes.
- Parent account updates.
- Student profile views by staff.
- Student profile updates.
- Teacher assignments.
- Schedule changes.
- Session report submissions.
- Requests approved or rejected.
- Payment status changes.
- Subscription changes.
- Data exports, if implemented later.

### Should Not Log

- Full payment links if sensitive.
- Full WhatsApp message body if it contains child details.
- Passwords or tokens.
- Secret keys.
- Full child notes in plaintext logs outside `audit_logs`.

---

## 10. Seed Data Policy

Only fictional seed data is allowed until security, RLS, and permission boundaries are tested.

### Allowed

- Fictional parents.
- Fictional students.
- Fictional teachers.
- Fictional schedules.
- Fictional reports.
- Fictional payments using fake references.

### Forbidden

- Real child names.
- Real parent phone numbers.
- Real WhatsApp numbers.
- Real payment references.
- Real teacher private data.
- Screenshots containing real student records.

---

## 11. Migration Safety Rules

No real migration should begin until owner approval.

### Before Any Real Migration

- Confirm source of truth for current student data.
- Confirm source of truth for payment data.
- Confirm source of truth for teacher assignments.
- Verify RLS policies using test accounts.
- Verify parent cannot see another family.
- Verify teacher cannot see unassigned students.
- Verify finance cannot see educational reports.
- Verify admin notes are hidden from parent and teacher users.
- Take backups before any import.
- Run import first in staging.
- Validate imported data manually.
- Obtain owner approval before production import.

---

## 12. Open Questions Before Implementation

1. Should `profiles.id` always equal Supabase Auth `auth.users.id`, or should it be an independent UUID linked by `auth_user_id`?
2. Should `teacher_id` be stored directly on `students`, or only through `enrollments`?
3. Should `available_seats` and `utilization_rate` be stored values or calculated views?
4. Should session generation happen daily, weekly, or on-demand?
5. How long should teachers be allowed to edit session reports?
6. Should parents see detailed payment history or only current status and payment link?
7. Should WhatsApp notifications be manual links only or integrated later through an official API?
8. Should audit logs be retained indefinitely or archived after a defined period?
9. What data residency region should Supabase use?
10. Should historical Fawaterk payment data be imported or tracked from go-live only?

---

## 13. Implementation Non-Goals

This document does not:

- Create a database.
- Create migrations.
- Create SQL files.
- Create a Next.js project.
- Add dependencies.
- Define final UI components.
- Store production secrets.
- Import real data.
- Deploy anything to production.

---

## 14. Owner Approval Checklist

Before schema implementation, the owner must approve:

- [ ] PostgreSQL through Supabase.
- [ ] Supabase Auth profile mapping strategy.
- [ ] RLS-first access model.
- [ ] Table list and relationships.
- [ ] Payment tracking without card data.
- [ ] Fictional seed data only.
- [ ] Migration safety rules.
- [ ] Audit logging requirements.
- [ ] Handling of internal notes and parent-visible notes.
- [ ] Data retention and backup expectations.

---

**Status**: Draft — awaiting owner approval.  
**Next Step**: Review and approve before creating migrations or implementation files.
```
