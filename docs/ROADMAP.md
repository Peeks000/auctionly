# AUCTIONLY — Master Implementation Roadmap (Phases 0 to 12)

**Execution Model:** Phased GSD with autonomous testing and verified checkpoints  
**Status:** Phase 0 Active  

---

### Phase 0: Workspace & Planning (Current Phase)
- [x] Workspace verification (`C:\Users\Yash\Desktop\repo 1`).
- [x] Inspection of tools: Node.js, npm, Git, GSD configuration.
- [x] Architecture, PRD, Database Schema, Threat Model, Design System.
- [x] Risk Register, Costs Register, Feature Status Register.
- [x] `.planning/` directory memory and workflow definitions.

### Phase 1: Brand & Design Foundation
- [ ] Implement SVG luxury logo suite: Wordmark, Monogram 'A', animated brand mark.
- [ ] Configure Tailwind CSS luxury tokens (`#111111`, `#242424`, `#E8DCC4`, `#C6A66A`, `#F5F0E7`).
- [ ] Establish global font loaders (Geist + Playfair Display).
- [ ] Build global layout shells: Luxury Header (with gold accent navigation), Minimal Footer, Breadcrumb system.

### Phase 2: Application Foundation & Security Core
- [ ] Initialize Next.js 15 App Router project structure with strict TypeScript.
- [ ] Create Supabase client and server configuration adapters.
- [ ] Author SQL database migrations for all tables, types, and RLS policies.
- [ ] Implement authentication flows: Login, Register, Session management, Role Guard middleware.
- [ ] Implement one-time Super Admin bootstrap routine with cryptographic validation.

### Phase 3: Marketplace Catalogue & 3D Immersion
- [ ] Implement the 7 initial categories taxonomy and seed data.
- [ ] Build Homepage: Cinematic 3D Hero scene (Three.js / React Three Fiber) with fallback.
- [ ] Implement Catalogue Grid: Filters by category, price, auction type, status, and search.
- [ ] Build Product Detail Page (PDP): Interactive 3D glTF/GLB viewer with 360 controls, zoom, and photo gallery fallback.
- [ ] Implement provenance trail viewer, condition report tab, and shipping estimator.

### Phase 4: Buyer & Seller Studios
- [ ] Buyer Dashboard: Overview, Active Bids, Won Auctions, Watchlist, Order History, Addresses.
- [ ] Seller Studio: Inventory overview, Consignment Wizard (multi-step listing form with draft autosave and 3D upload).
- [ ] Seller Verification Application: Submission of PAN/GST and identity records with status tracking.

### Phase 5: Authoritative Auction Engine
- [ ] Implement PostgreSQL atomic bidding RPC (`place_bid`) with row-level locks.
- [ ] Private Proxy Bidding: Automatic increment calculations while keeping max proxy amount secret.
- [ ] Anti-Sniping (Soft Close): Dynamic end-time extension when bids arrive in the closing window.
- [ ] Reserve Price Engine: Hidden reserve logic, "Reserve Met" status flags, unsold resolution.
- [ ] Buy Now Engine & Dual-Sale Prevention: Atomic inventory reservation locking against concurrent auction close.

### Phase 6: Live Auction System
- [ ] Build Live Auction Room with real-time bidding stream and participant list.
- [ ] Build Auctioneer Console: Start bidding, call increments, issue Fair Warning, Hammer Down, advance lot.
- [ ] Low-latency video/audio streaming abstraction adapter (with interactive development simulation).

### Phase 7: Financial Operations & Razorpay
- [ ] Razorpay Test Mode integration: Server-side order generation and signature verification.
- [ ] Webhook receiver with HMAC-SHA256 verification and idempotency protection.
- [ ] GST Tax Engine: Calculate CGST, SGST, IGST on Buyer's Premium and hammer prices.
- [ ] Invoicing: GST-compliant invoice generation with sequential numbering.
- [ ] Seller Settlement Ledger: Track commission deductions, payout holds, and manual payout approvals.

### Phase 8: Trust, Safety & Communication
- [ ] Private Buyer-Seller messaging system with RLS protection.
- [ ] In-app notification center for outbid alerts, auction endings, and order statuses.
- [ ] Structured Dispute Resolution workflow: Evidence upload, seller response window, admin arbitration.
- [ ] Fraud Detection: Shill bidding detection rules and bid velocity rate-limiting.

### Phase 9: AI Concierge & Marketplace Intelligence
- [ ] Floating AI Concierge widget with conversational discovery.
- [ ] Grounded search engine: Answers strictly from database inventory with zero hallucinations.
- [ ] Seller AI Assistant: Suggests refined lot descriptions and metadata tags.
- [ ] Hybrid provider adapter: Local Ollama / free-tier model support with response caching.

### Phase 10: Admin Command Center & Analytics
- [ ] Administrative overview: User management, verification queues, consignment moderation.
- [ ] Financial audit desk: Review orders, approve seller payouts, monitor dispute escrow.
- [ ] Analytics BI: GMV, sell-through rate, average hammer price, category breakdown.
- [ ] Policy Management: Terms of Service, Privacy Policy, Consignment Agreement versioning.

### Phase 11: Quality, Hardening & Accessibility
- [ ] Automated concurrency test suite: Simulate 50+ simultaneous bids to verify zero race conditions.
- [ ] Unit & Integration test suite: Jest / Vitest for business logic and financial calculations.
- [ ] Playwright E2E tests: Critical buyer and seller journeys.
- [ ] Accessibility Audit: WCAG 2.2 AA validation across all transactional forms and 3D fallbacks.

### Phase 12: GitHub, CI/CD & Cloud Deployment
- [ ] Initialize clean Git repository and push to GitHub `auctionly`.
- [ ] Configure GitHub Actions CI workflow (linting, tests, build).
- [ ] Deploy production beta to free-tier cloud platform (Netlify/Vercel) + Supabase Free.
- [ ] Verify live deployment URL and document setup guides in README.
