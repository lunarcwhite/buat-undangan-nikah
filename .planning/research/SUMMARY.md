# Project Research Summary

**Project:** Digital Wedding Invitation Maker SaaS
**Domain:** Digital Invitation SaaS
**Researched:** 2026-06-09
**Confidence:** HIGH

## Executive Summary

This research establishes the technology stack, core features, and architectural parameters for the Digital Wedding Invitation Maker SaaS. 

We recommend utilizing a Next.js (App Router) frontend deployed on Vercel, paired with Supabase for user authentication, metadata database, and Cloudinary for optimized wedding image uploads.

Key risks include slow invitation page load times due to unoptimized photo gallery uploads by users. This will be mitigated by requiring Cloudinary integration at early stages. Additionally, audio autoplay constraints must be resolved via click-to-play interfaces.

## Key Findings

### Recommended Stack

We recommend a Next.js 15.x stack paired with Tailwind CSS 4.x, utilizing Supabase as a backend (auth and DB) and Cloudinary for photo hosting.

**Core technologies:**
- Next.js: Core Web Framework — High performance, SSR/SEO ready.
- Tailwind CSS: Styling — Dynamic HSL-based coloring using CSS variables.
- Supabase: Database/Auth — Hosted PostgreSQL, SQL queries, user authentication out of the box.
- Cloudinary: Media storage — Automated image scaling and compression.

### Expected Features

**Must have (table stakes):**
- Dynamic theme variables (colors, fonts).
- Mobile-responsive visitor landing page (Hero, Map, RSVP, Guestbook blocks).
- RSVP data ingestion form.

**Should have (competitive):**
- Custom URL slugs.
- Photo gallery.
- Ambient audio playing controls.

### Architecture Approach

Invitations are generated dynamically by injecting theme database settings (from Supabase Postgres) directly into Next.js layouts as CSS Custom Properties.

## Implications for Roadmap

### Phase 1: Core Invitation Engine
**Rationale:** Establishing the base layout, public slug lookup, and theme variables injection must happen before user dashboards.
**Delivers:** Public landing page template dynamically styleable via CSS variables, basic RSVP capture.

### Phase 2: User Dashboard & Editor UI
**Rationale:** Once we can render themes and capture RSVPs, we build the dashboard where users can customize their invitation details.
**Delivers:** Authentication, theme editor, invitation dashboard.

### Phase 3: Media Integration & Polish
**Rationale:** Add support for rich features like image gallery and background music player.
**Delivers:** Cloudinary uploads, gallery component, music audio toggle.

---
*Research completed: 2026-06-09*
*Ready for roadmap: yes*
