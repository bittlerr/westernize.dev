# Westernize

AI-powered CV optimizer for Eastern European developers targeting Western tech companies. Users upload a CV + paste a job description, and the app returns a scored analysis, gap report, and AI-rewritten bullet points optimized for ATS systems and Western hiring culture.

## Tech Stack

- **Framework**: Next.js 16 (App Router), TypeScript strict
- **Styling**: Tailwind CSS 4 + CSS modules
- **AI**: Anthropic Claude API (`@anthropic-ai/sdk`, model: `claude-sonnet-4-6`), Zod schemas via `zodOutputFormat`
- **Auth**: better-auth (email/password, Drizzle adapter, email verification)
- **Database**: Supabase Postgres + Drizzle ORM
- **Payments**: Lemon Squeezy (credits-based, webhook-driven)
- **Rate Limiting**: Upstash Redis (`@upstash/ratelimit`)
- **Email**: Resend
- **PDF**: `pdf-parse` (validation) + Claude base64 inline (extraction)
- **DOCX Export**: `docx` npm package
- **Theme**: next-themes (dark default)
- **Toasts**: Sonner
- **Linting**: Biome
- **Analytics**: Umami (optional)
- **Deployment**: Vercel

## Architecture Decisions

- **No monorepo**: Single Next.js app for marketing, app, admin, and API
- **No tRPC**: API surface is 3 functional endpoints; Server Components + Drizzle provide type safety
- **Credits over subscriptions**: Job hunting is episodic; credits never expire, failures don't deduct
- **Upstash Redis over in-memory**: Serverless-compatible rate limiting on Vercel
- **PDF as base64**: Sent inline to Claude rather than via Files API beta
- **Biome over ESLint**: Single tool for linting + formatting

## Domain

westernize.dev

## Status

MVP implementation complete, pre-launch.
