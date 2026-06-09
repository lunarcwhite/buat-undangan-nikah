# Pitfalls Research

**Domain:** Digital Wedding Invitation Maker SaaS
**Researched:** 2026-06-09
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Unoptimized Media (Image bloat)

**What goes wrong:** Public invitation pages load MBs of unoptimized wedding gallery images, causing guests on mobile data to experience very slow loading or failed page responses.
**Why it happens:** Users upload raw 5-10MB photos directly from cameras.
**How to avoid:** Integrate Cloudinary and force size/quality transformations upon image rendering.
**Warning signs:** Slow PageSpeed Insights score; high mobile bandwidth bills.
**Phase to address:** Phase 2 (Media Integration).

---

### Pitfall 2: Browser Audio Policies Block Music

**What goes wrong:** background music auto-plays and fails immediately with errors because Chrome/Safari block auto-play without user interaction.
**Why it happens:** Browsers explicitly require a user gesture before playing audio.
**How to avoid:** Render a clean overlay or dynamic "Play Music" prompt requiring user interaction (click/tap) before initializing HTML5 audio.
**Warning signs:** Console errors `DOMException: play() failed because the user didn't interact with the document first.`
**Phase to address:** Phase 3 (Extra features/ polish).

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Skip local database migrations | Fast startup | DB state drift, schema conflicts | Never, Supabase migration files must track schema changes. |

---
*Pitfalls research for: Digital Wedding Invitation Maker SaaS*
*Researched: 2026-06-09*
