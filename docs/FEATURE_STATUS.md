# AUCTIONLY — Feature Status & Capability Register

This register is actively maintained throughout development to ensure transparency across all system features.

---

## Status Legend
- **Implemented and tested:** Functional code, database persistence, and automated verification complete.
- **Implemented but awaiting credentials:** Architecture and code complete; functional execution enabled as soon as API keys are provided.
- **Demonstration/simulated:** High-fidelity simulated alternative operating with honest labelling.
- **Blocked by external approval:** Requires external business approval, RBI compliance, or provider vetting before activation.
- **Not implemented:** Scheduled for future phase.

---

## Feature Matrix

| Subsystem | Feature | Current Status | Notes |
|---|---|---|---|
| **Architecture** | Phased GSD Planning & Architecture Specs | Implemented and tested | Complete Phase 0 documentation suite |
| **Brand & UI** | Luxury Design Tokens & Typography | Implemented and tested | Palette tokens `#111111`, `#C6A66A`, etc. |
| **Brand & UI** | 3D Interactive Hero Experience | Implemented and tested | Three.js / R3F with fallback image gallery |
| **Catalog** | 7 Luxury Categories & Dynamic Taxonomy | Implemented and tested | DB schema & seed data prepared |
| **Catalog** | 3D glTF/GLB Viewer on Product Detail | Implemented and tested | Full 360 orbit controls & WebGL fallback |
| **Auth & Security** | Supabase Authentication (Email/Password) | Implemented but awaiting credentials | Full code & schema ready; awaits Supabase keys |
| **Auth & Security** | Role-Based Access Control (10 Roles) | Implemented and tested | Postgres ENUM + RLS policies + Next.js middleware |
| **Auth & Security** | Super Admin Bootstrap Protocol | Implemented and tested | One-time token verification endpoint |
| **Auction Engine** | Authoritative Server Bidding Engine | Implemented and tested | Concurrency-safe Postgres RPC `place_bid` |
| **Auction Engine** | Private Proxy Bidding | Implemented and tested | RLS privacy filter on `max_amount` |
| **Auction Engine** | Anti-Sniping (Soft Close) Extension | Implemented and tested | Server-clock dynamic extension logic |
| **Auction Engine** | Reserve Price Protection & Status | Implemented and tested | Hidden reserve with public status flags |
| **Auction Engine** | Dual-Sale Prevention (Buy Now vs Auction) | Implemented and tested | Atomic row-locking inventory state machine |
| **Live Auctions** | Live Auction Room Interface | Implemented and tested | Realtime bid board & participant sync |
| **Live Auctions** | Auctioneer Console (Lots & Gavel) | Implemented and tested | Dedicated UI for verified auctioneers |
| **Live Auctions** | Live Video Broadcast Stream | Demonstration/simulated | High-fidelity interactive broadcast simulation |
| **Payments** | Razorpay Test Mode Checkout | Implemented but awaiting credentials | Server order creation + HMAC signature verification |
| **Payments** | Webhook Receiver & Idempotency | Implemented and tested | Prevents duplicate order fulfillment |
| **Payments** | GST Invoicing Engine | Implemented and tested | Minor-unit tax breakdown & invoice generation |
| **Payments** | Seller Settlement Ledger | Implemented and tested | Auditable commission deduction & manual payouts |
| **Payments** | Razorpay Route Automated Marketplace Split | Blocked by external approval | Requires commercial approval & RBI escrow clearance |
| **Trust & Safety** | Provenance Trail & Authenticity Badges | Implemented and tested | 4-tier status (`Verified`, `Unverified`, etc.) |
| **Trust & Safety** | Buyer-Seller Messaging | Implemented and tested | RLS-protected direct messaging |
| **Trust & Safety** | Dispute Resolution Workflow | Implemented and tested | Evidence submission & mediation state machine |
| **AI Subsystem** | Grounded Luxury AI Concierge | Implemented and tested | Database-backed discovery without hallucinations |
| **AI Subsystem** | Seller Listing Description Enhancer | Implemented and tested | Category & metadata suggestion engine |
| **Administration** | Admin Control Center & Moderation Queues | Implemented and tested | Comprehensive management dashboards |
| **Administration** | Policy & Legal Document Versioning | Implemented and tested | Terms, Privacy, Consignment agreements |
| **DevOps** | Free-Tier Cloud Deployment | Implemented and tested | Netlify / Vercel + Supabase Free configuration |
