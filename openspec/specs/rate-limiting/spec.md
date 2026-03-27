# Rate Limiting

## Purpose

Prevent API abuse using Upstash Redis-backed sliding window rate limiting, with different tiers for free and paid users.

## Requirements

### Requirement: Tiered Rate Limits

The optimization endpoint SHALL enforce different rate limits based on user tier.

#### Scenario: Free user rate limit

- **WHEN** a free user calls `/api/optimize`
- **THEN** allow max 3 requests per 3-hour sliding window

#### Scenario: Paid user rate limit

- **WHEN** a paid or lifetime user calls `/api/optimize`
- **THEN** allow max 20 requests per 20-hour sliding window

#### Scenario: Rate limit exceeded

- **WHEN** a user exceeds their rate limit
- **THEN** return HTTP 429 with error message "Rate limit exceeded, try again later"

### Requirement: Redis-Backed Storage

Rate limit state SHALL be stored in Upstash Redis for serverless compatibility.

#### Scenario: Serverless persistence

- **WHEN** rate limit checks are performed across multiple Vercel function invocations
- **THEN** state SHALL persist via Upstash Redis REST API
- **AND** use per-user keys with `rl:free` and `rl:paid` prefixes
