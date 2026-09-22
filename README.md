# TerraFlow AI — Unified Real Estate Intelligence

<div align="center">
  <h3>Autonomous Multichannel Real Estate Intelligence Platform</h3>
  <p>Where fragmented lead chaos converts into continuous kinetic momentum.</p>
</div>

---

## 🌟 Executive Overview

**TerraFlow AI** is a state-of-the-art landing page and lead intelligence engine designed for modern real estate brokerages, development teams, and high-volume acquisition firms. 

Traditional real estate operations lose up to 40% of inbound buyers to fragmented inquiry streams (portals, WhatsApp, inbound calls, paid social). TerraFlow unifies these fragmented signals into an autonomous kinetic pipeline:
* **Capture:** Zero-leakage multichannel ingestion across all portals and messaging apps.
* **Qualify:** Sub-second AI evaluation of purchasing power, timeline, and intent.
* **Act:** Autonomous high-touch follow-up and instant tour coordination.
* **Convert:** Frictionless handover to brokers with actionable buyer dossiers.

---

## 🏗️ Architecture & Narrative Flow

The landing page is structured as a cinematic multi-act narrative with tactile micro-interactions, responsive typography, and kinetic physics:

### 1. Hero / The Landscape (`TerraflowGsapHero.tsx`)
* Seamless multi-layer parallax terrain (sky, mountains, midground, foreground).
* Dynamic atmospheric fog, real-time lighting transitions, and responsive floating navigation.
* Clean kinetic floating badge system (`AUTONOMOUS INTELLIGENCE`).

### 2. ACT III / The Transformation (`LeadChaosSection.tsx`)
* Dynamic interactive kinetic sculpture inspired by physical momentum.
* Real-time demonstration of turning chaotic incoming signals into aligned, rhythmic velocity.

### 3. ACT IV / Architecture (`IntelligentFlowSection.tsx`)
* Four interactive autonomous intelligence cards:
  1. **Multichannel Ingestion Engine** — Aggregating portals, SMS, ads, and webchat.
  2. **Sub-Second Intent Classifier** — Dynamic credit & buying window scoring.
  3. **Continuous Kinetic Follow-up** — Conversational agent that never lets a deal go cold.
  4. **CRM Sync & Broker Dispatch** — Real-time handover to high-producing agents.
* Clean white architectural background with responsive hover depth and interactive cards.

### 4. ACT V / Impact & ROI (`ImpactROISection.tsx`)
* Quantitative performance scorecard featuring real estate metrics:
  * **+38%** Conversion Velocity
  * **< 60s** First Contact SLA
  * **-45%** Operational Overhead

### 5. ACT VI / The Conversation (`CinematicConversationSection.tsx`)
* Tailored consultation intake form for enterprise brokerages and portfolio leads.
* Captures work email, firm name, and current operational bottlenecks.
* Persists directly to Supabase with instant bidirectional email routing.

---

## ⚙️ Tech Stack & Engineering Standards

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | High-performance server rendering & API endpoints |
| **Language** | TypeScript | Strict type-safety across all components and API handlers |
| **Styling** | Vanilla CSS + Design Tokens | Zero runtime bloat, fluid layouts, custom CSS variables |
| **Motion** | GSAP + CSS Transitions | 60 FPS hardware-accelerated animations & kinetic sculpts |
| **Database** | Supabase (PostgreSQL) | Secure lead storage with Row Level Security (RLS) |
| **Email** | Resend API | Transactional branded email dispatch with custom templates |
| **Deployment** | Vercel | Global edge CDN, automated CI/CD builds on push |

---

## 📧 Branded Email System (Powered by Resend)

The application includes 3 customized email templates featuring an embedded animated cinemagraph banner derived from the hero environment:

1. **Private Beta Waitlist Confirmation (White Theme):**
   * Sent to visitors upon joining the waitlist.
   * Features a clean architectural porcelain layout, emerald status badge, and priority access queue reservation.
2. **Consultation & Architecture Inquiry Receipt (White Theme):**
   * Sent to enterprise prospects who complete the ACT VI inquiry form.
   * Echoes their submitted context, company, and establishes a 24-hour turnaround SLA.
3. **High-Value Inbound Team Notification (Dark Theme):**
   * Internal alert dispatched to the TerraFlow operations team.
   * Formatted in deep obsidian `#080A0F` with luminous mint `#2DD4BF` highlights, complete dossier table, and a 1-click `Reply to Prospect` action button.

---

## 🛡️ Security & Anti-Abuse

* **Rate Limiting:** Sliding-window rate limiter per client IP (5 submissions per minute maximum) to prevent spam attacks.
* **Honeypot Trap:** Hidden decoy form fields transparently filter out automated bot crawlers.
* **Secret Isolation:** Supabase Service Role keys and Resend credentials execute strictly in server-side API routes (`app/api/*`).
* **Clean Git Hygiene:** `.env.local` is strictly excluded from version control via `.gitignore`.

---

## 🚀 Getting Started Locally

### 1. Clone the Repository
```bash
git clone https://github.com/TerraFlowAI/Landing-Page-waitlist.git
cd Landing-Page-waitlist
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Resend Email Configuration
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=Terraflow <onboarding@resend.dev>
TEAM_NOTIFICATION_EMAIL=terraflow78@gmail.com
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Production Deployment

### Deploying to Vercel
1. Connect your GitHub repository `TerraFlowAI/Landing-Page-waitlist` to [Vercel](https://vercel.com/new).
2. Configure the environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`).
3. Click **Deploy**. Vercel will build the Next.js application and provide an SSL-secured production URL with automatic deployments on each push to `main`.

---

## 📄 License & Ownership

Copyright © 2026 **TerraFlow AI, Inc.** All rights reserved.  
Unified Real Estate Intelligence.
