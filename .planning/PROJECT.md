# AUCTIONLY — Project Memory & Master Charter

## 1. Executive Summary
- **Brand:** AUCTIONLY
- **Tagline:** Own the Extraordinary.
- **Workspace:** `repo 1` (`C:\Users\Yash\Desktop\repo 1`)
- **Target GitHub Repository:** `auctionly` (new public repository)
- **Primary Market:** India-first (INR `₹`), globally extensible multi-currency architecture
- **Language:** English
- **Release Strategy:** Two-Stage Delivery:
  - **Stage 1 (Current Target):** Competition-ready, invitation-based private beta featuring real database persistence, authoritative server-side auction engine, 3D interactive hero and galleries, test-mode Razorpay financial workflows, granular RBAC, and free-tier deployment.
  - **Stage 2:** Controlled commercial activation (live Razorpay, KYC, split payouts, production AI).

## 2. Core Pillars & Non-Negotiables
1. **Authentic Functionality over Mockups:** No simulated UI masquerading as complete. Workflows, validation, authorization, atomic persistence, and failure handling must be real.
2. **Authoritative Server Auction Engine:** Bids are validated and committed server-side with PostgreSQL transactions/locks, anti-sniping extension, private proxy bidding, and concurrency safety. Client clocks never govern deadlines.
3. **Dual-Sale Prevention:** Atomic database guarantees ensure no inventory item can simultaneously be won in auction and purchased via Buy Now.
4. **Luxury Aesthetics & Restraint:** Deep blacks (`#111111`), warm darks (`#242424`), champagne (`#E8DCC4`), muted gold (`#C6A66A`), warm ivory (`#F5F0E7`). Cinematic 3D experiences with high-fidelity 2D/360 fallbacks and accessible controls.
5. **Security & Least Privilege:** Row Level Security (RLS) on all Supabase tables, zero service-role keys exposed in browser, independent server-side permission checks, signature-verified webhooks.
6. **Zero Unapproved Spend:** Free-tier-first architecture (Supabase Free, Netlify/Vercel Free, Razorpay Test Mode, local Ollama/free AI). No automatic billing, no unapproved purchases.

## 3. Seven Marketplace Categories
1. **Fine Art & Paintings:** Canvas, oil, acrylics, traditional Indian miniatures, modern masterpieces.
2. **Sculptures & Decorative Art:** Bronze, marble, stone, ceramic, artisanal heritage works.
3. **Antiques & Historical Objects:** Period pieces, royal artifacts, colonial and ancient relics.
4. **Coins, Stamps & Numismatics:** Rare currency, historical mints, postal philately.
5. **Watches & Jewellery:** Haute horlogerie, vintage chronographs, precious gems, royal jewels.
6. **Rare Books & Manuscripts:** First editions, signed folios, historical documents, calligraphy.
7. **Vintage Design & Furniture:** Mid-century modern, Art Deco, architectural decorative pieces.
