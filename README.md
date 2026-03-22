# Westernize

AI-powered CV optimization for Eastern European developers targeting Western tech companies. Upload your CV + job description, get a match score, gap analysis, and westernized bullet points in minutes.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **AI:** Claude API (Anthropic SDK)
- **Database:** PostgreSQL (Supabase) + Drizzle ORM
- **Auth:** better-auth (email/password)
- **Payments:** Lemon Squeezy (webhooks)
- **Rate Limiting:** Upstash Redis
- **Email:** Resend
- **Analytics:** Umami
- **Styling:** Tailwind CSS 4
- **Linting/Formatting:** Biome

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL database (Supabase recommended)
- Anthropic API key
- Upstash Redis instance

### Setup

1. Clone the repo and install dependencies:

```bash
pnpm install
```

2. Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

3. Push the database schema:

```bash
pnpm drizzle-kit push
```

4. Start the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Yes | Random secret for auth sessions |
| `BETTER_AUTH_URL` | Yes | App URL (e.g. `http://localhost:3000`) |
| `ANTHROPIC_API_KEY` | Yes | Claude API key |
| `UPSTASH_REDIS_REST_URL` | Yes | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Yes | Upstash Redis REST token |
| `LEMONSQUEEZY_API_KEY` | No | Lemon Squeezy API key |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | No | Webhook signature verification |
| `LEMONSQUEEZY_STORE_ID` | No | Lemon Squeezy store ID |
| `RESEND_API_KEY` | No | Resend email API key |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | No | Umami analytics website ID |
| `NEXT_PUBLIC_UMAMI_URL` | No | Umami script URL (defaults to cloud) |

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Check linting + formatting (Biome) |
| `pnpm lint:fix` | Auto-fix lint + format issues |
| `pnpm format` | Format all files |
| `pnpm drizzle-kit push` | Push schema to database |
| `pnpm drizzle-kit generate` | Generate migration files |
| `pnpm drizzle-kit migrate` | Run migrations |

## Project Structure

```
app/
  (marketing)/     Landing, login, signup, legal pages
  (app)/           Authenticated app (dashboard, optimize, results)
  admin/           Admin dashboard (users, optimizations, audit)
  api/             Route handlers (optimize, parse-pdf, export, auth, webhooks)
components/        Shared UI components
db/                Drizzle schema + migrations
lib/               Server utilities (auth, claude, credits, rate-limit, etc.)
types/             Zod schemas + shared TypeScript types
```

## How It Works

1. User uploads CV (text or PDF) + pastes job description
2. AI pipeline runs 4 steps via SSE:
   - Parse CV structure (parallel)
   - Parse JD requirements (parallel)
   - Gap analysis + scoring (sequential)
   - Rewrite bullet points (sequential)
3. User reviews results: match score, missing keywords, rewritten bullets
4. Accept/edit/reject individual bullets, download as DOCX

## Pricing Model

- **Free:** 3 optimizations (no card needed)
- **Starter Pack:** 5 optimizations for $12
- **Job Hunt Pack:** 15 optimizations for $29
- **Lifetime:** Unlimited for $49

## License

Proprietary. All rights reserved.
