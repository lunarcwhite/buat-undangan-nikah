# Stack Research

**Domain:** Digital Wedding Invitation Maker SaaS
**Researched:** 2026-06-09
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 15.x | Core Web Framework | Standard React meta-framework with excellent SEO, App Router, SSR, Server Actions, and easy Vercel deployment. |
| Tailwind CSS | 4.x | Styling | Utility-first styling framework, default for Next.js, lightweight, flexible, and themeable. |
| Supabase | Client SDK | Database & Auth | Open-source Firebase alternative hosting Postgres, database client, and fully configured authentication. |
| Cloudinary | Client SDK | Media Storage | Industry standard for optimized image storage, transformations, and global CDN delivery. |
| TypeScript | 5.x | Programming Language | Typed JavaScript, ensures code quality, matches database schema interfaces directly. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | latest | Icons | Dynamic icons for invitations & builder dashboard. |
| shadcn/ui | latest | UI Components | Pre-styled, accessible, copy-paste components. |
| date-fns | latest | Date Utilities | Formatting wedding event dates and RSVP limits. |
| react-hook-form | latest | Form Management | RSVP and Invitation editor configurations. |
| zod | latest | Validation | Safe payload parsing for theme configurations and form fields. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Supabase CLI | Local DB Emulator | Used for database migrations and testing schema changes locally. |
| ESLint / Prettier | Linting & Formatting | Standardized code styling guidelines. |

## Installation

```bash
# Core & Supporting
npm install @supabase/supabase-js cloudinary date-fns react-hook-form zod lucide-react

# Dev dependencies
npm install -D typescript @types/node @types/react @types/react-dom eslint prettier
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Next.js App Router | Vite React SPA | If we did not require SSR/SEO for invitation landing pages (invitations *must* be indexable and fast). |
| Supabase Postgres | Prisma + Neon | If we wanted an ORM rather than Supabase Client direct access / Postgres APIs. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Plain CSS | High verbosity, slow prototyping of dynamic themes. | Tailwind CSS + CSS Variables |
| Local file uploads | Vercel's ephemeral filesystem deletes media on server restarts. | Cloudinary |

---
*Stack research for: Digital Wedding Invitation Maker SaaS*
*Researched: 2026-06-09*
