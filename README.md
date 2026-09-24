# NagarSeva – AI-Powered Civic Issue Reporting Platform

**Project ID:** SKIT/CSE/2023-2027/04  
**Institution:** Swami Keshvanand Institute of Technology, Management & Gramothan (SKIT), Jaipur  
**Department:** Computer Science & Engineering (CSE) | Section A  
**Track:** Innovation | **SDG Mapping:** SDG 11 – Sustainable Cities and Communities  
**External Evaluation:** Poster Competition  
**Repository:** [https://github.com/CodeBreaker-0111/SKIT-CSE-2023-2027-04](https://github.com/CodeBreaker-0111/SKIT-CSE-2023-2027-04)  

---

## 📌 Project Overview

**NagarSeva** is an AI-powered civic issue reporting and tracking platform designed for citizens and municipal authorities in Jaipur. The platform enables residents to report civic problems (potholes, garbage dumps, street lighting, water leakage, etc.) with description, location, and media evidence. Integrated AI capabilities automatically analyze media, predict issue severity and priority, and recommend the relevant municipal department.

---

## 👥 Project Team & Roles

| Name | Role & Expertise | Technical Scope |
| --- | --- | --- |
| **Aaditya Bansal** | Team Lead (AI/ML & GIS) | Project Management, System Architecture, Gemini AI Integration, Jaipur Ward Mapping |
| **Anmol Gupta** | Member 1 (Backend & DB) | Backend Services, Supabase PostgreSQL, RLS Policies, Database Architecture |
| **Anshul Nagar** | Member 2 (Frontend/UI) | Next.js/React Frontend, Tailwind UI, Report Form, Responsive Dashboard, Map UI |
| **Anushka Agrawal** | Member 3 (Testing & Integration) | API Integration, Testing, Twilio Notifications, Accessibility, i18n & Speech APIs |

---

## 🛠️ Technology Stack

| Layer | Technologies | Status |
| --- | --- | --- |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 | Active |
| **Backend & DB** | Supabase PostgreSQL, Supabase Auth, Supabase Storage *(Migrating from Firebase)* | Active / In Migration |
| **AI Integration** | Google Gemini API (`@google/genai` with `gemini-3.6-flash`) | Active |
| **GIS & Mapping** | OpenStreetMap, Leaflet, `react-leaflet`, Jaipur Ward Datasets | Active / Ward Layer In Dev |
| **Notifications** | Twilio SMS/APIs | Planned (Sprint 7) |
| **Accessibility & i18n** | `i18next`, `react-i18next`, Web Speech API (STT/TTS) | Active |

---

## 🗺️ Official 8-Sprint Development Roadmap

1. **Sprint 1: System & UI Foundation** *(Continuously Improving)*
   - Project structure, responsive Next.js App Router layout, design tokens, core page routing.
2. **Sprint 2: Authentication & Database** *(In Progress)*
   - Supabase Auth setup, PostgreSQL database schema (`profiles`, `reports`, `report_status_history`), RLS policies.
3. **Sprint 3: Issue Reporting & Media** *(In Progress)*
   - Citizen report submission form, media upload validation, Supabase Storage `report-media` bucket.
4. **Sprint 4: AI Analysis & Categorization** *(Getting Trained)*
   - Gemini 3.6 Flash vision analysis, category classification, severity & priority scoring, department routing.
5. **Sprint 5: Jaipur GIS & Ward Mapping** *(In Progress)*
   - Jaipur map centering (`[26.9124, 75.7873]`), Leaflet markers, Jaipur ward boundary GeoJSON integration, hotspot visualization.
6. **Sprint 6: Dashboard & Tracking** *(In Progress)*
   - Citizen "My Reports" status tracking, Admin monitoring dashboard, status updates & filtering.
7. **Sprint 7: Notifications & Accessibility** *(Planned)*
   - Twilio notifications, multilingual language toggle, Web Speech voice interaction, accessibility enhancements.
8. **Sprint 8: Integration, Testing & Deployment** *(Planned)*
   - End-to-end integration testing, security audit, build verification, deployment configuration.

---

## 🏗️ Project Architecture & Migration Status

The NagarSeva platform is currently executing a progressive migration from legacy prototype infrastructure to cloud-scale relational architecture:

```text
Next.js / React Frontend (TypeScript + Tailwind CSS)
       │
       ├─► Supabase Auth (OAuth & User Sessions)
       ├─► Supabase PostgreSQL (profiles, reports, status history)
       ├─► Supabase Storage (report-media bucket)
       ├─► Google Gemini API (Image/Video analysis, priority scoring, translation)
       └─► Leaflet / OpenStreetMap (Jaipur ward-wise GIS mapping)
```

> **Note on Legacy Modules:** Firebase authentication and Firestore code are being systematically replaced by Supabase services. Firebase modules are retained strictly to preserve working application state until Supabase backend migration passes full integration testing.

---

## ⚡ Local Setup Instructions

```bash
# 1. Clone repository
git clone https://github.com/CodeBreaker-0111/SKIT-CSE-2023-2027-04.git
cd SKIT-CSE-2023-2027-04

# 2. Install dependencies
npm install

# 3. Configure environment variables (.env.local)
# Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, GOOGLE_API_KEY

# 4. Start local development server
npm run dev
```

Application will run locally at `http://localhost:3000`.

---

## 📄 License & Evaluation Context

Developed for official academic evaluation under **SKIT Jaipur - CSE Department (2023-2027)** for **Poster Competition & Innovation Track**.
