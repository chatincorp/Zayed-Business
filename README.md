# YASIR ZAYED — Corporate Website

**Business Development · Consultancy · Security · Technology**

> "Building Stronger Businesses. Smarter Systems. Secure Futures."

---

## Overview

A premium, modern, high-conversion corporate website for **Yasir Zayed** — a multi-disciplinary business, technology, digital transformation, AI, and security company. This is not a generic template. It is a fully custom-built web application with an integrated admin panel, AI-powered content tools, financial market dashboards, and a complete editorial workflow.

## Features

### Public Website
- **Hero Carousel** — 7 animated slides with Ken Burns effect and service illustrations
- **Service Catalog** — 10+ services across Business Development, Technology, and Security
- **Zayed Tabloid** — AI-curated news from global sources with editorial workflow
- **Live Financial Markets** — 36 stock exchanges across 7 global regions
- **Live Forex** — 40+ currency pairs with continental/regional breakdowns
- **Pricing** — 6 company registration types with Paystack payment integration
- **Contact** — Global phone selector with 100+ countries, RBAC office routing
- **About (The Zayed Brief)** — Full company profile, mission, vision, capabilities
- **YasBot** — Floating AI chatbot with 15+ response categories
- **WhatsApp Integration** — Direct link to +254 717 227 012
- **Social Media Bar** — Facebook, Twitter/X, Instagram, LinkedIn, YouTube
- **Partner Logos Carousel** — 19 technology partners with auto-scrolling display
- **Cookieless Privacy Notice** — GDPR-compliant privacy-first notification

### Admin Panel (`/admin`)
- **Dashboard** — KPI cards, quick actions, recent leads, system health
- **Services Manager** — Full CRUD with category filter, visibility toggle
- **Leads Management** — Status pipeline (New → Contacted → Qualified → Converted)
- **Testimonials** — Star ratings, featured toggle, create/edit/delete
- **FAQ Manager** — Accordion CRUD with category filtering
- **Blog / Insights** — Article list with status badges and view counts
- **Analytics** — Traffic metrics, weekly charts, top pages
- **Tabloid Editor** — Article creation, AI rewrite, editorial pipeline
- **Editorial Dashboard** — Content Creator → Editor → Publisher workflow
- **News Sources** — Manage and edit source feeds
- **Users** — Role-based access (Super Admin, Admin, Editor, Author, Viewer)
- **System Health** — 8 services with uptime and latency monitoring
- **Security Logs** — YASIR VERIFY activity, rate limiting, blocked requests
- **Integrations** — Convex, Paystack, WhatsApp, OpenAI, Cloudflare
- **SEO Dashboard** — Page scores, keyword rankings, technical health
- **Media Library** — File upload grid with type filtering
- **Global Settings** — Brand identity, logo, notification bar

### Demo Pages
- `/demo/corporate` — BlackRock-style corporate website replica
- `/demo/webapp` — Booking.com-style web application replica
- `/demo/ecommerce` — Amazon.com-style e-commerce store replica

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite |
| **Styling** | Tailwind CSS v4, shadcn/ui |
| **Animation** | Framer Motion |
| **Backend** | Convex (serverless functions + database) |
| **Auth** | Convex Auth |
| **Routing** | React Router v7 |
| **Payments** | Paystack |
| **AI** | OpenAI (chatbot, content rewrite) |
| **Icons** | Lucide React |

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) 18+ (20+ recommended)
- [Bun](https://bun.sh/) (recommended) or npm
- A [Convex](https://convex.dev/) account (free tier available)

### 1. Clone & Install
```bash
git clone https://github.com/your-org/yasir-zayed-web.git
cd yasir-zayed-web
bun install
```

### 2. Set Up Convex
```bash
bunx convex dev --once
```
This will prompt you to create or link a Convex project.

### 3. Start Development
```bash
bun dev
```
Open [http://localhost:5173](http://localhost:5173)

### 4. Build for Production
```bash
bun run build
```

### 5. Preview Production Build
```bash
bun preview
```

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `VITE_CONVEX_URL` | Convex deployment URL | Yes |
| `PAYSTACK_PUBLIC_KEY` | Paystack public key | For payments |
| `OPENAI_API_KEY` | OpenAI API key | For AI features |

> Do not edit `.env` files directly. Use the Freebuff Keys/API keys UI.

## Project Structure

```
src/
├── components/
│   ├── admin/          # Admin panel feature components
│   ├── sections/       # Landing page sections
│   ├── tabloid/        # Stock & forex ticker components
│   └── ui/             # shadcn/ui components
├── data/               # Mock data and types
├── pages/              # Route pages
│   ├── tabloid/        # Tabloid, Markets, Forex, Editorial
│   └── demos/          # Demo replica pages
├── convex/             # Convex backend functions
├── hooks/              # Custom React hooks
├── main.tsx            # App entry & routing
└── index.css           # Global styles & animations
```

## Deployment

See [Installme.md](./Installme.md) for detailed deployment instructions covering:
- Local development (Windows, macOS, Linux)
- VPS / Dedicated servers
- cPanel / WHM shared hosting
- Docker
- Vercel / Netlify / Cloudflare Pages
- Freebuff Platform

## License

Proprietary — Yasir Zayed Business Development & Consultancy.

---

**Yasir Zayed** · Nairobi, Kenya · +254 114 712 989 · +254 717 227 012 · info@yasirzayed.com
