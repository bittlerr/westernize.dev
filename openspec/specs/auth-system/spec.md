# Auth System

## Purpose

Authentication and user management using better-auth with email/password, email verification, and role-based access control.

## Requirements

### Requirement: Email and Password Authentication

The system SHALL support email/password authentication with email verification required before access.

#### Scenario: User signup

- **WHEN** a user submits the signup form with name, email, and password
- **THEN** create a user record with default `credits: 3`, `isLifetime: false`, `role: "user"`
- **AND** send a verification email via Resend
- **AND** log audit event `signup`
- **AND** send a welcome email

#### Scenario: Email verification

- **WHEN** the user clicks the verification link
- **THEN** mark `emailVerified: true`
- **AND** auto sign-in the user
- **AND** redirect to the verified confirmation page

#### Scenario: User login

- **WHEN** a user submits email and password
- **THEN** validate credentials and create a session
- **AND** redirect to `/dashboard`

#### Scenario: Password reset

- **WHEN** a user requests a password reset
- **THEN** send a reset email with a 1-hour expiry link
- **AND** the reset form SHALL validate matching passwords and minimum 8 characters

### Requirement: Session-Based Access Control

Protected routes SHALL require a valid session.

#### Scenario: App routes protection

- **WHEN** a user accesses any route under `(app)/`
- **THEN** the layout SHALL check `auth.api.getSession()` from request headers
- **AND** redirect to `/login` if no valid session

#### Scenario: Admin routes protection

- **WHEN** a user accesses any route under `admin/`
- **THEN** check for valid session AND `role === "admin"`
- **AND** redirect to `/dashboard` if not admin

#### Scenario: Auth page routing

- **WHEN** an authenticated user accesses `/login`, `/signup`, or other auth pages
- **THEN** redirect them away from auth pages to the app
- **AND** when an unauthenticated user accesses protected routes, redirect to `/login`

### Requirement: Custom User Fields on Session

The session SHALL expose custom user fields without extra DB queries.

#### Scenario: Session data

- **WHEN** a session is active
- **THEN** it SHALL include `credits` (number), `isLifetime` (boolean), and `role` (string)
- **AND** these SHALL be accessible in both server and client components

### Requirement: Auth Rate Limiting

Authentication endpoints SHALL be rate limited to prevent abuse.

#### Scenario: Auth rate limit

- **WHEN** a client makes more than 5 auth requests in 60 seconds
- **THEN** reject further requests until the window expires
