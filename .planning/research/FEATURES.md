# Feature Research

**Domain:** Digital Wedding Invitation Maker SaaS
**Researched:** 2026-06-09
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Dynamic Theme Selection | Invitation must match wedding theme (colors, typography). | MEDIUM | Handled via CSS variables. |
| RSVP Form | Guests need to confirm attendance. | LOW | Directly writes to DB. |
| Guestbook / Comments | Guests leave wishes for the couple. | LOW | Realtime support is highly valued. |
| Event Details & Map | Location, time, map integration. | LOW | Google Maps embed/link. |
| Mobile Optimization | 90% of invitees view on mobile. | HIGH | Responsive design is critical. |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Modular Section Ordering | Let users arrange parts (e.g., RSVP before Gallery). | HIGH | JSON config based layout. |
| Custom Slug Configuration | Short, recognizable links (`invitation.me/john-jane`). | LOW | Unique route lookup. |
| Photo Gallery | Dynamic photos of the couple. | MEDIUM | Cloudinary optimization integration. |
| Audio/Music Background | Ambient music playing on page load. | LOW | Browser audio policy constraints apply. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Heavy Flash Animations | "Looks pretty" | Bad mobile performance, slow load times, poor SEO. | CSS transitions and clean micro-animations. |
| Auto-Play Audio (default) | Music vibes | Blocked by default on Safari/Chrome; scares users. | Silent by default with a visible toggle button. |

## Feature Dependencies

```
[Invitation Editor]
    └──requires──> [Theme Engine]
                       └──requires──> [Tailwind & CSS Variables]

[RSVP Form] ──writes──> [Database System (Supabase)]
```

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the concept.

- [x] **Theme Engine:** Apply custom theme colors and fonts dynamically.
- [x] **Invitation Viewer:** Mobile-responsive invitation pages featuring Hero, Map, RSVP, and Guestbook blocks.
- [x] **RSVP System:** Basic guest attendance collection.

### Add After Validation (v1.x)

- [ ] **Photo Gallery:** Cloudinary image gallery upload.
- [ ] **Background Audio:** Background music player with user controls.

### Future Consideration (v2+)

- [ ] **Custom Section Reordering:** Drag-and-drop builder layout rearrangement.

---
*Feature research for: Digital Wedding Invitation Maker SaaS*
*Researched: 2026-06-09*
