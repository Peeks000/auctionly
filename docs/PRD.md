# AUCTIONLY — Product Requirements Document (PRD)

**Brand:** AUCTIONLY  
**Tagline:** Own the Extraordinary.  
**Version:** 1.0.0-beta  
**Status:** Approved for Implementation  
**Target Market:** India-first (INR), globally extensible  
**Language:** English  

---

## 1. Product Overview & Vision
AUCTIONLY is a premier digital auction house and curated marketplace engineered for rare collectibles, fine art, historical antiquities, luxury timepieces, and exceptional design objects. 

The platform synthesizes the prestige, trust, and curatorial standards of premier physical auction institutions (e.g., Sotheby's, Christie's) with the speed, transparency, 3D immersion, and security of modern digital platforms.

AUCTIONLY rejects generic e-commerce templates with superficial countdown timers. Instead, it introduces an authoritative, server-driven auction engine, multi-format bidding, private proxy calculations, anti-sniping dynamic closures, 3D product visualization, GST-compliant financial invoicing, and an auditable provenance trail.

---

## 2. Target Personas & User Journeys

### 2.1 Personas
1. **The Connoisseur / Buyer (e.g., Vikram, 42, Private Collector):**
   - High net worth individual seeking rare modern art, antique numismatics, and vintage horology.
   - Values authenticity guarantees, high-resolution condition reports, transparent bid histories, private proxy bidding, and smooth checkout via familiar Indian banking rails (UPI/Netbanking/Cards via Razorpay).
2. **The Consignor / Seller (e.g., Ananya, 35, Gallery Curator or Estate Dealer):**
   - Professional gallery owner or verified independent collector.
   - Demands intuitive consignment workflows, 3D/high-res media uploads, transparent reserve management, real-time bid tracking, automated invoicing, and clear settlement statements.
3. **The Professional Auctioneer (e.g., Rajesh, 50, Licensed Specialist):**
   - Manages live marquee auction sessions.
   - Demands low-latency lot control, incremental bid adjustments, audio/visual stream orchestration, fair warning calls, and definitive hammer-down execution.
4. **The Specialist / Moderator / Administrator (Internal Staff):**
   - Reviews consignments, verifies provenance documentation, manages disputes, supervises anti-fraud alarms, and reconciles financial settlements.

### 2.2 Core User Journeys
- **Journey A (Discovery to Win):** Visitor lands on cinematic 3D homepage → Browses Curated Collection → Inspects 3D model & condition report of 19th Century Tanjore Miniature → Registers & verifies phone → Places private proxy bid of ₹3,50,000 → Outbid alert triggers push/email → Increases bid → Outbids competitor during soft-close window (triggers 2-min extension) → Hammer falls, declared winner → Redirected to Razorpay checkout → Pays with GST invoice generation → Tracks specialist white-glove shipping.
- **Journey B (Consignment & Curation):** Gallery submits vintage Patek Philippe chronograph via Seller Studio → Enters provenance history, upload high-res photos and 3D glTF file → AI suggests refined title & metadata → Submitted to Verification Specialist → Specialist approves lot and schedules for Timed Auction with ₹12,00,000 reserve → Auction concludes above reserve → Automatic settlement calculation records payout minus 8% seller commission.
- **Journey C (Live Auction Gala):** Buyer enters Live Auction Room → Live stream simulation broadcasts auctioneer audio/video → Bidders compete with one-click bid increments → Auctioneer issues "Fair Warning" and closes lot → Realtime Supabase broadcast informs all attendees.

---

## 3. Scope & Non-Goals

### 3.1 In Scope (Beta Release)
1. **Multi-Format Sales:** Authoritative timed auctions, scheduled live auction rooms, and fixed-price Buy Now (with dual-sale prevention).
2. **Authoritative Server Auction Engine:** Atomic bid processing, PostgreSQL transaction locks, private proxy bids, server-time anti-sniping extensions, and reserve-met indicators.
3. **Seven Core Categories:**
   - Fine Art & Paintings
   - Sculptures & Decorative Art
   - Antiques & Historical Objects
   - Coins, Stamps & Numismatics
   - Watches & Jewellery
   - Rare Books & Manuscripts
   - Vintage Design & Furniture
4. **Rich 3D Visualization:** Three.js / React Three Fiber interactive hero experience, 3D glTF/GLB product viewer with 360-degree controls and responsive fallback galleries.
5. **Role-Based Access Control (RBAC):** 10 distinct roles with secure one-time Super Admin initialization token.
6. **Payment & Financial Engine:** Razorpay Test Mode integration, payment signature validation, webhook handling, GST tax calculation, downloadable invoices, and seller settlement ledger.
7. **Trust & Provenance:** Provenance document verification workflow, clear authenticity badges (`Verified`, `Unverified`, `Under Review`, `Disputed`), and buyer protection dispute workflows.
8. **AI Concierge:** Database-grounded assistant for lot discovery and description assistance with zero fabricated inventory.
9. **Accessibility & Responsiveness:** WCAG 2.2 AA compliant, full keyboard operability, screen-reader auction updates, and adaptive mobile design.
10. **Free-Tier Infrastructure:** Deployed on free cloud hosting (Netlify/Vercel) + Supabase Free with documented resource quotas.

### 3.2 Non-Goals & Fenced Scope
1. **Live Production Payments:** Real money collection and live Razorpay Route marketplace splitting are deferred to Stage 2 after legal compliance and KYC approvals.
2. **Automatic Escrow Representation:** AUCTIONLY does not claim to hold third-party financial escrow without RBI-authorized intermediary licenses.
3. **AI Authenticity Certification:** AI is prohibited from certifying the physical authenticity or valuation of any object.
4. **Unfettered Public Admin Sign-up:** No public endpoint or registration form will ever grant administrative rights.

---

## 4. Key Performance Indicators (KPIs)
- **Bid Placement Latency:** Server commit and realtime broadcast < 200ms.
- **Concurrency Integrity:** Zero duplicate winners, zero double-sold lots under 100 concurrent requests.
- **Accessibility:** 100% WCAG 2.2 AA compliance on all core transactional flows.
- **Lighthouse Performance:** 90+ Score for SEO, Accessibility, Best Practices, and 85+ on Performance with 3D fallbacks.
