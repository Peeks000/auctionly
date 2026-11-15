# AUCTIONLY — Scoped Requirements & Verification Traceability

## REQ-01: Identity, RBAC & Super Admin Bootstrap
- **REQ-01.1:** Authentication supporting Email/Password, OAuth (Google), and phone OTP verification interfaces.
- **REQ-01.2:** 10 discrete roles: `Visitor`, `Buyer`, `Seller`, `Professional Auctioneer`, `Moderator`, `Verification Specialist`, `Customer Support`, `Finance Manager`, `Administrator`, `Super Admin`.
- **REQ-01.3:** Secure, one-time Super Admin bootstrap mechanism protected by an initialization secret token and MFA requirement. First registered public user CANNOT be auto-elevated.
- **REQ-01.4:** Session revocation, device management, and sensitive-action re-authentication.

## REQ-02: Luxury Design System & 3D Immersion
- **REQ-02.1:** Custom AUCTIONLY wordmark, luxury emblem monogram 'A', animated brand mark, responsive variants, and favicon.
- **REQ-02.2:** Luxury color token system: `#111111`, `#242424`, `#E8DCC4`, `#C6A66A`, `#F5F0E7`.
- **REQ-02.3:** Typography pairing: Modern Sans-Serif (Geist / Inter) for UI precision + Refined Serif (Playfair Display / Cormorant) for editorial elegance.
- **REQ-02.4:** Three.js / React Three Fiber interactive hero scene with gold rim lighting, camera movement, fallback image preview, and reduced-motion detection.
- **REQ-02.5:** 3D GLB/glTF model viewer on product pages with 360-degree rotation, zoom, lighting presets, and high-res photo gallery fallback.

## REQ-03: Catalogue & Listing Lifecycle
- **REQ-03.1:** 7 initial categories with dynamic database schema and admin configurability.
- **REQ-03.2:** Listing wizard with draft autosave, rich media uploads, provenance documentation, condition reports, dimensions, and materials.
- **REQ-03.3:** Listing state machine: `Draft → Pending Review → Approved → Published` with rejection, suspension, and withdrawal states.
- **REQ-03.4:** AI description enhancer and category recommender without granting AI automatic approval or authenticity certification authority.

## REQ-04: Authoritative Auction Engine & Bidding
- **REQ-04.1:** Three sale formats: Timed Auctions, Live Auctions, and Buy Now (with combined hybrid support).
- **REQ-04.2:** Server-side authoritative bid validation against PostgreSQL clocks (`now()`). Client browser clocks never dictate bid validity.
- **REQ-04.3:** Concurrency-safe transactions (`SELECT ... FOR UPDATE` or serializable RPC) preventing race conditions, negative increments, or inconsistent bid histories.
- **REQ-04.4:** Private Proxy Bidding: Bidder inputs maximum willingness to pay; engine bids up to the minimum necessary increment. Max proxy amount is strictly secret from all other bidders and public views.
- **REQ-04.5:** Anti-Sniping (Soft Close): Any eligible bid placed within closing window (e.g., last 3 minutes) dynamically extends the auction by configured duration (e.g., 2 minutes).
- **REQ-04.6:** Reserve Price Protection: Hidden reserve amount; public indicator of "Reserve Met" / "Reserve Not Met"; automatic "No Sale" or seller negotiation flow if reserve is unmet at conclusion.
- **REQ-04.7:** Dual-Sale Prevention: Atomic inventory reservation preventing simultaneous auction win and Buy Now checkout for the same physical lot.

## REQ-05: Live Auction Room & Auctioneer Controls
- **REQ-05.1:** Dedicated live auction room with real-time bidding feed, participant list, lot sequence viewer, and audio/visual stream abstraction.
- **REQ-05.2:** Auctioneer Console restricted to verified Auctioneers and Admins: Introduce Lot, Start Bidding, Call Increment, Pause/Resume, Fair Warning, Close Lot / Hammer Down, Move to Next Lot.
- **REQ-05.3:** Low-latency WebRTC / streaming adapter with graceful fallback to simulated interactive auctioneer console during development and testing.

## REQ-06: Financial Engine, Invoicing & Settlement
- **REQ-06.1:** Razorpay Test Mode integration: Server-side order creation (`razorpay.orders.create`), signature verification (`crypto.createHmac`), and webhook verification.
- **REQ-06.2:** Strict integer / minor unit monetary math in INR (paisa) to avoid IEEE 754 floating-point inaccuracies.
- **REQ-06.3:** Configurable revenue model: Buyer's Premium (e.g., 10-15%), Seller Commission (e.g., 5-10%), and GST tax calculations.
- **REQ-06.4:** Invoicing engine: GST-compliant invoice generation with sequential numbering, breakdown of lot price, buyer's premium, tax components (CGST/SGST/IGST), and downloadable format.
- **REQ-06.5:** Auditable Seller Settlement Ledger: Tracks gross proceeds, commission deductions, dispute holds, payout requests, manual approvals, and payout records.

## REQ-07: Trust, Safety, Authenticity & Disputes
- **REQ-07.1:** Tiered verification: Buyer basic verification, Seller identity & business verification (PAN/GST/ID), Enhanced high-value bidder approval.
- **REQ-07.2:** Authenticity badges and provenance trail with 4 clear states: `Verified`, `Unverified`, `Under Review`, `Disputed`. AI never certifies authenticity.
- **REQ-07.3:** Risk scoring and fraud detection: Flagging shill bidding (bids from linked IP/accounts), bid retraction abuse, and suspicious velocity.
- **REQ-07.4:** Dispute resolution system: Structured workflow for damage, misrepresentation, non-delivery, evidence submission, mediation timeline, and refund escrow resolution.

## REQ-08: AI Concierge & Intelligence
- **REQ-08.1:** Floating luxury AI Concierge grounded strictly in database inventory. No hallucinating non-existent lots or fabricating bids.
- **REQ-08.2:** Conversational search and natural-language lot discovery.
- **REQ-08.3:** Cost guardrails: Local Ollama / free-tier model adapters, response caching, token limits, zero client-exposed API keys.

## REQ-09: Administration, Operations & Analytics
- **REQ-09.1:** Comprehensive Admin Command Center: User management, listing approvals, live auction supervisor, transaction monitoring, dispute mediation, and audit logs.
- **REQ-09.2:** Real-time analytics: Gross Merchandise Value (GMV), sell-through rates, average lot value, active bidders, and category breakdown.
- **REQ-09.3:** Policy management: Version-controlled Terms of Service, Privacy Policy, Buyer Agreement, Seller Consignment Terms, and Prohibited Items.

## REQ-10: Quality, Security & Free-Tier Deployment
- **REQ-10.1:** Comprehensive automated tests: Unit tests, API integration tests, concurrency race tests, and Playwright E2E suites.
- **REQ-10.2:** WCAG 2.2 AA accessibility: Screen-reader announcements for real-time bids, full keyboard navigation, non-color status indicators, and 3D fallbacks.
- **REQ-10.3:** Zero unapproved spend deployment on Netlify/Vercel and Supabase Free with documented quotas, automated backups, and health checks.
