# AUCTIONLY — Own the Extraordinary.

> A premier digital auction house and curated marketplace engineered for exceptional fine art, rare antiquities, vintage horology, and high-value collectibles.

[![Next.js](https://img.shields.io/badge/Next.js-15_App_Router-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-black?logo=three.js)](https://threejs.org/)
[![Vercel Production](https://img.shields.io/badge/Vercel-Deployed_Production-black?logo=vercel)](https://vercel.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_%26_Auth-3ECF8E?logo=supabase)](https://supabase.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Test_Mode-0C2340?logo=razorpay)](https://razorpay.com/)
[![License](https://img.shields.io/badge/License-Proprietary-gold)](#)

---

## ⚡ Production Deployment
- **Platform:** Vercel Production
- **Build Status:** Passing (Built in 41s, optimized Next.js 15 App Router static & dynamic routes)
- **Repository:** [https://github.com/Peeks000/auctionly](https://github.com/Peeks000/auctionly)
- **Deployment URL:** Accessible via Vercel Dashboard (peeks000 projects)

---

## 1. Product Overview

AUCTIONLY bridges the prestige of historic international auction houses with contemporary 3D immersion and financial-grade transactional security. Built India-first (INR) with a globally extensible architecture, AUCTIONLY provides genuine working functionality across timed auctions, live virtual auction rooms, and fixed-price Buy Now sales.

### Core Highlights
- **Authoritative Server Auction Engine:** PostgreSQL atomic row-locking prevents race conditions. Authoritative server time governs soft-close extensions and hammer falls.
- **Private Proxy Bidding:** Maximum willingness to pay is shielded by PostgreSQL Row Level Security (RLS).
- **Dual-Sale Prevention:** Atomic inventory state transitions prevent concurrent auction wins and Buy Now purchases.
- **Cinematic 3D & 360 Experiences:** Built with Three.js and React Three Fiber with comprehensive 2D photographic fallbacks.
- **10 Granular Roles:** Strict privilege separation with a one-time cryptographic Super Admin bootstrap protocol.
- **GST-Compliant Invoicing & Seller Settlements:** Minor-unit (paisa) financial precision, automated invoice generation, and auditable payout ledger.
- **Grounded AI Concierge:** Real-time conversational discovery backed strictly by database inventory (zero hallucinations).

---

## 2. Technology Stack

- **Frontend:** Next.js 15 (App Router), TypeScript (Strict), Tailwind CSS, React Three Fiber, Three.js, Lucide Icons.
- **Backend & Database:** Supabase PostgreSQL with Row Level Security (RLS), Supabase Auth, Supabase Storage, Supabase Realtime.
- **Payments:** Razorpay (Test Mode) with server-side HMAC-SHA256 signature verification and idempotent webhooks.
- **Deployment:** Netlify Free / Vercel Free with zero-spend guardrails.

---

## 3. Getting Started Locally

### Prerequisites
- Node.js `v20+` or `v26+`
- npm `10+`
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/Peeks000/auctionly.git
cd auctionly

# Install dependencies
npm install

# Configure environment variables
copy .env.example .env.local
```

### Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 4. Super Admin Initial Setup

AUCTIONLY never auto-elevates public users. To provision the initial Super Admin:
1. Register a standard user account through the web interface (e.g. `admin@auctionly.luxury`).
2. Set a secure `SUPER_ADMIN_BOOTSTRAP_KEY` in your `.env.local`.
3. Submit a `POST` request to `/api/admin/bootstrap`:
   ```bash
   curl -X POST http://localhost:3000/api/admin/bootstrap \
     -H "Content-Type: application/json" \
     -d '{"bootstrapKey": "YOUR_SECURE_KEY", "email": "admin@auctionly.luxury"}'
   ```
4. The system permanently marks the bootstrap as completed; subsequent attempts return HTTP 410.

---

## 5. Documentation Directory

For complete engineering and architectural specifications, consult the `docs/` suite:
- [PRD & User Journeys](docs/PRD.md)
- [Technical Architecture](docs/ARCHITECTURE.md)
- [Database Schema & RLS Matrix](docs/DATABASE.md)
- [Security & Threat Model](docs/SECURITY.md)
- [Luxury Design System](docs/DESIGN_SYSTEM.md)
- [Phased Implementation Roadmap](docs/ROADMAP.md)
- [Testing & Concurrency Strategy](docs/TESTING.md)
- [Free-Tier Deployment Plan](docs/DEPLOYMENT.md)
- [External Integrations & Fallbacks](docs/INTEGRATIONS.md)
- [Feature Status Register](docs/FEATURE_STATUS.md)
- [Risk Register](docs/RISKS.md)
- [Free-Tier Cost Register](docs/COSTS.md)

---

## 6. Feature Status & Transparency Disclosures
- **Razorpay Payments:** Implemented in Test Mode (`rzp_test_...`). Live money collection is strictly deferred to Stage 2 commercial activation.
- **Live Video Stream:** Live auction room includes a high-fidelity interactive simulation console.
- **AI Concierge:** Operates via local Ollama or high-fidelity deterministic fallback; forbidden from certifying authenticity.
- **Free-Tier Limits:** Documented in [docs/COSTS.md](docs/COSTS.md). Automatic billing is strictly disabled.
