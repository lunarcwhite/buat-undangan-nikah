# Architecture

**Analysis Date:** 2026-06-09

## System Patterns

- Greenfield workspace. Next.js App Router structure will be used.
- Component-driven architecture using Shadcn UI.
- Client-Server data fetching model utilizing Supabase client/server actions.

## Data Flow

- User interacts with Next.js Frontend.
- Next.js fetches/mutates data using Supabase Client SDK or Next.js Server Actions.
- Supabase hosts PostgreSQL database and Auth services.
- Media upload/retrieval is routed to/from Cloudinary.

## Abstractions & Core Interfaces

- None defined yet. Refer to database schema in `PRD.md` section 3.

---

*Architecture analysis: 2026-06-09*
