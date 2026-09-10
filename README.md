# NagarSeva – AI-Powered Civic Issue Reporting Platform

NagarSeva is an AI-powered civic issue reporting platform designed to help citizens report, categorize, locate, and track civic problems through a centralized digital system.

The platform combines Artificial Intelligence, GIS-based mapping, cloud services, and accessible web technologies to improve the reporting and monitoring of civic issues in Jaipur.

---

## Project Information

**Project ID:** SKIT/CSE/2023-2027/04  
**Branch:** Computer Science Engineering (CSE)  
**Section:** A  
**Project Title:** NagarSeva – AI-Powered Civic Issue Reporting Platform  
**SDG Mapping:** SDG 11 – Sustainable Cities and Communities  
**Project Track:** Innovation  
**External Evaluation:** Poster Competition  

---

## Problem Statement

Citizens often lack a unified platform to report civic issues and track their resolution. Existing reporting processes can be fragmented and provide limited categorization, prioritization, geographical visibility, and status tracking.

NagarSeva aims to provide a centralized platform where citizens can report civic issues with descriptions, media evidence, and location information while AI assists in categorization and prioritization and GIS enables ward-wise visualization.

---

## Objectives

- Enable citizens to report civic issues through a simple digital platform.
- Use AI to categorize issues and assist in severity and priority analysis.
- Provide Jaipur ward-wise GIS mapping and geographical visualization.
- Enable citizens to track submitted reports and their status.
- Improve accessibility through multilingual and voice-related features.
- Support better monitoring and coordination of civic issues through dashboards and notifications.

---

## Key Features

### Civic Issue Reporting
- Report civic problems with descriptions.
- Select or identify issue categories.
- Upload image or video evidence.
- Capture or provide issue location.
- Track submitted reports.

### AI-Powered Analysis
- AI-assisted civic issue categorization.
- Severity assessment.
- Priority analysis.
- Department recommendation.
- AI-generated issue summary.
- Structured AI response handling.

### Jaipur GIS & Ward Mapping
- Interactive map-based civic issue visualization.
- Jaipur ward-wise mapping.
- Location-based report markers.
- Ward and issue-based filtering.
- Civic issue hotspot visualization.

### Dashboard & Tracking
- Citizen dashboard.
- My Reports section.
- Report status tracking.
- Report filtering and monitoring.
- Administrative monitoring capabilities.

### Notifications & Accessibility
- Notification support through APIs.
- Multilingual interface.
- Accessibility-focused UI.
- Voice-related interaction using available browser capabilities.

---

## Technology Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Next.js API Routes / Node.js
- Supabase
- PostgreSQL

### Authentication
- Supabase Auth
- Google OAuth

### Storage
- Supabase Storage

### Artificial Intelligence
- Google Gemini API

### GIS & Mapping
- Leaflet
- OpenStreetMap
- Jaipur ward-wise geographic data

### Communication & Accessibility
- Twilio APIs
- i18next / language support
- Browser Speech APIs

---

## System Architecture

```text
                    +----------------------+
                    |       Citizens       |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    |   NagarSeva Web App  |
                    |   Next.js / React    |
                    +----------+-----------+
                               |
             +-----------------+------------------+
             |                 |                  |
             v                 v                  v
      +-------------+   +-------------+   +-------------+
      | Supabase    |   | Gemini AI   |   | GIS / Maps  |
      | Auth        |   | Analysis    |   | Leaflet +   |
      | PostgreSQL  |   | & Category  |   | OpenStreetMap|
      | Storage     |   +-------------+   +-------------+
      +-------------+
             |
             v
      +------------------+
      | Reports / Status |
      | / User Data      |
      +------------------+
             |
             v
      +------------------+
      | Dashboard / Admin|
      +------------------+
