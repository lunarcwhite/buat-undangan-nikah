# Product Requirements Document (PRD): Digital Wedding Invitation Maker

## 1. Project Overview
- **Name:** Digital Wedding Invitation Maker SaaS
- **Objective:** Create a platform where users can generate dynamic, personalized digital invitations.
- **Budget:** 0 Rupiah (Use free tiers only).
- **Core Value:** Users can choose between pre-made templates or custom theme configurations (colors, fonts, layout).

## 2. Tech Stack Specification
- **Frontend:** Next.js (App Router), Tailwind CSS.
- **Deployment:** Vercel (or Netlify).
- **Database/Auth:** Supabase (PostgreSQL).
- **Storage:** Cloudinary (for image optimization).
- **UI Components:** Shadcn UI or similar modular components.

## 3. Data Architecture (AI-Reference)
AI Agent must follow this schema for database consistency:

### 3.1. Tables
- **Users**: Standard Auth data.
- **Templates**: 
  - `id` (uuid), `name` (string), `default_config` (jsonb).
- **Invitations**: 
  - `id` (uuid), `user_id` (fk), `slug` (unique string), 
  - `content_data` (jsonb: {bride_name, groom_name, event_date, location, etc.}), 
  - `theme_config` (jsonb: {primary_color, font_family, section_order: []}).

## 4. Key Features & Logic
- **Modular Sections:** Invitations are composed of blocks (Hero, Gallery, RSVP, Map, Guestbook).
- **Theme Engine:** Apply `theme_config` dynamically via CSS variables:
  ```css
  :root { --primary-color: <value>; }