<!-- GSD:project-start source:PROJECT.md -->

## Project

**Digital Wedding Invitation Maker SaaS**

A platform where users can generate dynamic, personalized digital wedding invitations. It enables couples to choose pre-made templates or customize themes (colors, typography, layout) to showcase their wedding details, capture RSVPs, and collect guestbooks.

**Core Value:** Couples can deploy a highly customizable, mobile-responsive wedding invitation page that reliably collects RSVPs and guest wishes.

### Constraints

- **Budget:** 0 Rupiah (Use free tiers only).
- **Stack:** Next.js (App Router), Tailwind CSS, Supabase, Cloudinary.

<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->

## Technology Stack

## Languages

- None (Greenfield project, PRD proposes Next.js/Tailwind/TypeScript)
- Markdown - Documentation (`PRD.md`)

## Runtime

- Node.js (To be initialized)

## Frameworks

- None initialized yet (PRD specifies Next.js App Router, Tailwind CSS, Supabase, Shadcn UI)

## Key Dependencies

- None yet

## Configuration

- None yet (PRD specifies database auth using Supabase, image optimization using Cloudinary)

## Platform Requirements

- Windows 11 (Current development environment)
- Node.js / npm
- Vercel (or Netlify) as specified in PRD

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## Coding Style & Standards

- Next.js (TypeScript) conventions will be adopted upon project initialization.
- Naming: camelCase for variables/functions, PascalCase for components, kebab-case for directories.
- CSS styling via Tailwind CSS utility classes.

## Error Handling

- Standard Next.js error boundary patterns.
- Proper error catching and propagation for database/API calls.

<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

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

<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.agent/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
