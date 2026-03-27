# Admin Dashboard

## Purpose

Internal dashboard for the founder to monitor users, optimizations, credits, and audit logs. All pages are server components with direct DB queries.

## Requirements

### Requirement: Admin Access Control

The admin dashboard SHALL be restricted to users with `role === "admin"`.

#### Scenario: Admin access

- **WHEN** a user with `role: "admin"` accesses `/admin/*`
- **THEN** render the admin layout with sidebar navigation

#### Scenario: Non-admin access

- **WHEN** a user without admin role accesses `/admin/*`
- **THEN** redirect to `/dashboard`

### Requirement: Overview Metrics

The admin overview page SHALL display key business metrics.

#### Scenario: Viewing overview

- **WHEN** an admin visits `/admin`
- **THEN** display metric cards: total users, total optimizations, signups in last 7 days
- **AND** show the 20 most recent audit log entries

### Requirement: User Management

The admin SHALL be able to view and manage users.

#### Scenario: User list

- **WHEN** an admin visits `/admin/users`
- **THEN** display a paginated table (50 per page) with: email, credits, lifetime status, role, join date
- **AND** support search by email (case-insensitive)

#### Scenario: User detail and actions

- **WHEN** an admin visits `/admin/users/[id]`
- **THEN** display user info, credit balance, and action buttons
- **AND** support server actions: add credits (arbitrary amount), toggle lifetime, toggle admin role
- **AND** each action SHALL log to the audit log

### Requirement: Optimization Viewer

The admin SHALL be able to browse all optimizations.

#### Scenario: Optimization list

- **WHEN** an admin visits `/admin/optimizations`
- **THEN** display a paginated table with: date, user email, role (from JD), score, status
- **AND** support filtering by status (all, pending, done, error)

### Requirement: Audit Log Viewer

The admin SHALL be able to browse all audit logs.

#### Scenario: Audit log list

- **WHEN** an admin visits `/admin/audit`
- **THEN** display a paginated table with: time, action, user ID, metadata
- **AND** support filtering by action type
