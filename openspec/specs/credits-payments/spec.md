# Credits and Payments

## Purpose

Credits-based monetization via Lemon Squeezy. Users purchase credit packs or lifetime access. Credits are deducted only on successful optimizations.

## Requirements

### Requirement: Credits-Based Pricing Model

The system SHALL use a credits-based model with no subscriptions.

#### Scenario: Free tier

- **WHEN** a new user signs up
- **THEN** they receive 3 credits by default
- **AND** credits never expire

#### Scenario: Paid credit packs

- **GIVEN** the following pricing tiers:
  - Starter: $12 for 5 optimizations
  - Job Hunt: $49 for 50 optimizations
- **WHEN** a user purchases a pack
- **THEN** add the corresponding credits to their account

#### Scenario: Lifetime access

- **WHEN** a user purchases the Lifetime tier ($49)
- **THEN** set `isLifetime: true` on their user record
- **AND** they SHALL have unlimited optimizations

### Requirement: Credit Deduction Logic

Credits SHALL only be deducted on successful pipeline completion.

#### Scenario: Successful optimization

- **WHEN** all 4 pipeline steps complete
- **THEN** atomically decrement `credits` by 1 using `UPDATE users SET credits = credits - 1 WHERE id = ? AND credits > 0 AND is_lifetime = false`

#### Scenario: Failed optimization

- **WHEN** the pipeline fails at any step
- **THEN** do NOT deduct a credit

#### Scenario: Lifetime user

- **WHEN** `isLifetime` is true
- **THEN** skip credit deduction entirely

### Requirement: Credit Check Before Pipeline

The system SHALL verify credit availability before starting the pipeline.

#### Scenario: Sufficient credits

- **WHEN** `credits > 0` OR `isLifetime === true`
- **THEN** allow the optimization to proceed

#### Scenario: Insufficient credits

- **WHEN** `credits === 0` AND `isLifetime === false`
- **THEN** return HTTP 402

### Requirement: Lemon Squeezy Webhook Processing

The system SHALL process Lemon Squeezy webhooks to add credits.

#### Scenario: Order created webhook

- **WHEN** receiving a `POST /api/webhook/lemonsqueezy` with event `order_created`
- **THEN** verify the HMAC-SHA256 signature using `LEMONSQUEEZY_WEBHOOK_SECRET`
- **AND** extract email and variant ID from the payload
- **AND** look up the user by email
- **AND** add credits based on variant→credits mapping
- **AND** log audit event `credits.purchased` with purchase metadata

#### Scenario: Invalid signature

- **WHEN** the webhook signature fails verification
- **THEN** return 401

#### Scenario: Unknown variant

- **WHEN** the variant ID doesn't match any known mapping
- **THEN** log a warning and return 200 (don't block Lemon Squeezy retries)

### Requirement: Checkout URL Generation

The system SHALL generate pre-filled Lemon Squeezy checkout URLs.

#### Scenario: Generating checkout link

- **WHEN** building a checkout URL for a variant
- **THEN** include the user's email as `checkout[email]` parameter
- **AND** include the store ID as `checkout[custom][store_id]`
