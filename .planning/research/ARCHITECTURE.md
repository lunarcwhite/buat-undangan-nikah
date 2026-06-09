# Architecture Research

**Domain:** Digital Wedding Invitation Maker SaaS
**Researched:** 2026-06-09
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                       Next.js Frontend                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ Editor  │  │ Viewer  │  │ Theme   │  │ RSVP    │        │
│  │ Dashboard  │  │ Page    │  │ Context │  │ Form    │        │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
│       │            │            │            │              │
├───────┴────────────┴────────────┴────────────┴──────────────┤
│                         Data Layer                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   Supabase Client                   │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                       Infrastructure                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │ Postgres │  │ Auth     │  │Cloudinary│                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Editor Dashboard | Managing Invitation settings & templates | React Forms / Editor UI |
| Viewer Page | Public Invitation page shown to guests | Next.js Server Components / ISR / Dynamic Route |
| Theme Context | Applies custom CSS variables dynamically | React Context API injecting style tags / inline styles |
| RSVP Form | Submits guest attendance | Supabase direct mutation |

## Recommended Project Structure

```
src/
├── app/
│   ├── (dashboard)/            # Dashboard layout and invitation editors
│   ├── [slug]/                 # Public-facing invitation detail pages
│   └── page.tsx                # Homepage
├── components/
│   ├── blocks/                 # Modular invitation blocks (Hero, Map, RSVP)
│   └── ui/                     # Shadcn components
├── hooks/                      # Custom React hooks (Supabase state, theme variables)
└── lib/                        # Helper utils (supabaseClient.ts, cloudinary.ts)
```

## Architectural Patterns

### Pattern: CSS Variables Theme Engine

**What:** Pass custom colors and typography definitions from DB configuration as CSS inline style variables on the outer wrapper.
**When to use:** Anytime we need server-rendered customizable themes.
**Trade-offs:** Fast load time, bypasses heavy JS-in-CSS injection.

**Example:**
```tsx
export default function InvitationWrapper({ theme, children }) {
  return (
    <div style={{
      '--primary-color': theme.primary_color,
      '--font-family': theme.font_family,
    } as React.CSSProperties}>
      {children}
    </div>
  );
}
```

---
*Architecture research for: Digital Wedding Invitation Maker SaaS*
*Researched: 2026-06-09*
