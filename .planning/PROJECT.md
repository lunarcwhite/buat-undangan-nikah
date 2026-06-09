# Digital Wedding Invitation Maker SaaS

## What This Is

A platform where users can generate dynamic, personalized digital wedding invitations. It enables couples to choose pre-made templates or customize themes (colors, typography, layout) to showcase their wedding details, capture RSVPs, and collect guestbooks.

## Core Value

Couples can deploy a highly customizable, mobile-responsive wedding invitation page that reliably collects RSVPs and guest wishes.

## Requirements

### Validated

(None yet — greenfield initialization)

### Active

- [ ] Initialize Next.js project with Tailwind CSS and TypeScript
- [ ] Implement Supabase database integrations for templates, invitations, RSVPs, and guestbook tables
- [ ] Build dynamic Theme Engine utilizing CSS variables mapped to invitation configs
- [ ] Create mobile-responsive Invitation Visitor Page (`/[slug]`) rendering Hero, Event Info, Maps, RSVP, and Guestbook blocks
- [ ] Create User Dashboard for invitation management and details editing

### Out of Scope

- **Real-time chat:** High complexity and not required for invitation capture.
- **Native Mobile Apps:** Web-first responsive landing pages are sufficient.
- **Custom domain mapping:** Deferred to v2+ (slugs under primary domain are sufficient).

## Context

We are starting a greenfield project based on `PRD.md`. The target development OS is Windows. The app must run on Vercel with free-tier Postgres database support provided by Supabase.

## Constraints

- **Budget:** 0 Rupiah (Use free tiers only).
- **Stack:** Next.js (App Router), Tailwind CSS, Supabase, Cloudinary.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js App Router | High SEO potential for invitation landing pages, SSR support, built-in routing. | — Pending |
| Supabase Auth & DB | Simplifies user tables, session handling, and hosts PostgreSQL natively. | — Pending |
| Theme via CSS Variables | Native CSS custom variables map directly to DB config, enabling clean real-time styling changes without CSS-in-JS. | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-09 after initialization*
