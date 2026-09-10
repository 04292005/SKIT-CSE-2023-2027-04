# NagarSeva – AI Development Context

## Project

NagarSeva is an AI-Powered Civic Issue Reporting Platform designed for citizens and municipal authorities in Jaipur.

Project ID: `SKIT/CSE/2023-2027/04`  
Institution: Swami Keshvanand Institute of Technology, Management & Gramothan (SKIT), Jaipur  
Track: Innovation  
SDG: SDG 11 – Sustainable Cities and Communities  

---

## Technical Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Shadcn UI / Radix UI
- Framer Motion

### Backend & Database (Target Architecture)
- Supabase Auth (Google OAuth & User Session Management)
- Supabase PostgreSQL (`profiles`, `reports`, `report_status_history` tables)
- Supabase Storage (`report-media` bucket)

> *Note:* Legacy Firebase Auth/Firestore modules are being progressively migrated to Supabase services. Working Firebase code is preserved during transition to maintain application stability.

### AI Engine
- Google Gemini API (`@google/genai` with model `gemini-3.6-flash`)
- Structured JSON output for category analysis, severity, priority score, and department recommendation.

### GIS & Maps
- Leaflet + OpenStreetMap (`react-leaflet`)
- Centered on Jaipur coordinates (`[26.9124, 75.7873]`)
- Jaipur ward-wise boundary mapping & civic issue markers

### Internationalization & Accessibility
- `i18next` & `react-i18next` multilingual UI
- Web Speech API (Speech-to-Text and Text-to-Speech)

---

## Directory Architecture

```text
src/
├── ai/                # Gemini client, config, and vision analysis agents
├── app/               # Next.js App Router (pages & API endpoints)
├── components/        # Shared UI and layout components (Navbar, Footer)
├── config/            # Application static configurations
├── constants/         # Site metadata and navigation constants
├── features/          # Feature modules (admin, auth, dashboard, landing, map, report, tracking)
├── firebase/          # Legacy Firebase integration (under active migration to Supabase)
├── hooks/             # Shared custom React hooks
├── i18n/              # Translation dictionaries and i18next setup
├── lib/               # Utility libraries and Supabase clients (client.ts, server.ts)
├── providers/         # Context providers (Auth, Theme, i18n)
├── services/          # Unified data service interfaces
├── types/             # Shared TypeScript type definitions
└── utils/             # Helper utilities
```

---

## Coding Rules & Guidelines

1. **Incremental Migration:** Maintain working functionality while migrating from Firebase to Supabase.
2. **Strict Typing:** Keep TypeScript strict with clean interfaces.
3. **No Unvalidated AI:** AI outputs must be validated before database insertion or state mutation.
4. **Environment Safety:** Keep API keys and credentials restricted to `.env.local` (never commit secrets).
5. **Build Integrity:** Ensure `npx tsc --noEmit` and `npm run build` pass after every architectural change.
