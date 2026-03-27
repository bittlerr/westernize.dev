# Audit Logging

## Purpose

Track all significant user and system actions for debugging, analytics, and admin visibility.

## Requirements

### Requirement: Action Logging

The system SHALL log all significant actions to the `audit_logs` table.

#### Scenario: Logged actions

- **WHEN** any of the following events occur
- **THEN** insert a row with `userId`, `action`, `metadata`, and `createdAt`:
  - `signup` — user creates account
  - `cv.optimized` — optimization completes successfully (metadata: optimizationId, matchScore, tokens)
  - `cv.exported` — user downloads DOCX
  - `credits.purchased` — Lemon Squeezy webhook processes a purchase (metadata: variant, credits, email)
  - `admin.credits_added` — admin manually adds credits
  - `admin.lifetime_toggled` — admin toggles lifetime status
  - `admin.role_changed` — admin changes user role

#### Scenario: Nullable userId

- **WHEN** a system event occurs without a user context
- **THEN** `userId` SHALL be null

### Requirement: Admin Audit Log Viewer

The admin dashboard SHALL provide a filterable view of all audit logs.

#### Scenario: Filtering audit logs

- **WHEN** an admin views `/admin/audit`
- **THEN** display a paginated table (50 per page)
- **AND** support filtering by action type and pagination
