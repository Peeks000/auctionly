# AUCTIONLY — Comprehensive Testing & Quality Assurance Strategy

**Target Reliability:** Financial-Grade Correctness & Concurrency Integrity  
**Frameworks:** Vitest / Jest (Unit & Integration), Playwright (E2E), axe-core (Accessibility), Custom Concurrency Test Harness  

---

## 1. Test Pyramid & Automation Architecture

```
                  / \
                 / E2E \          Playwright (Critical Paths)
                /-------\
               /   Race  \        Multi-threaded Concurrency Harness
              /-----------\
             / Integration \      API Routes, Supabase RPC, Razorpay Signatures
            /---------------\
           /    Unit Tests   \    Proxy math, GST calculations, Zod validators
          +-------------------+
```

---

## 2. High-Priority Test Suites

### 2.1 Concurrency & Anti-Race Condition Test
- **Objective:** Prove that 50 concurrent requests competing for the same lot cannot corrupt the bid sequence, create double winners, or bypass minimum increment rules.
- **Test Matrix:**
  1. *Simultaneous Bids:* 20 simulated bidders submit varying proxy amounts at the exact same millisecond.
  2. *Verification:*
     - The bids table contains an orderly monotonic sequence of prices.
     - The final high bidder is strictly the one who submitted the highest proxy amount.
     - The auction `current_price` accurately reflects the second highest proxy + minimum increment.
     - Exactly one winner is declared when the clock expires.
  3. *Hammer vs Buy Now Race:* User A clicks Buy Now at the same millisecond Auctioneer hits hammer or auction timer elapses.
     - Database locks lot inventory atomically.
     - Exactly one transaction succeeds; the other receives HTTP 409 Conflict with a clean message.

### 2.2 Financial & Signature Verification Tests
- **Signature Integrity:** Test Razorpay webhook signatures with valid secrets, invalid secrets, corrupted payloads, and modified order IDs. Verify only valid HMAC-SHA256 signatures are accepted.
- **Webhook Idempotency:** Transmit the identical `payment.captured` webhook 5 times sequentially and 5 times concurrently. Confirm the order is updated once, and seller settlement is credited exactly once.
- **GST Minor Unit Calculation:** Verify that all taxes (CGST 9%, SGST 9% or IGST 18%) calculate cleanly on minor integer units without fractional paisa rounding errors.

### 2.3 Role Escalation & RLS Penetration Tests
- **Direct Update Prevention:** Authenticated `buyer` attempts `supabase.from('profiles').update({ role: 'super_admin' }).eq('id', auth.uid())`. Verify RLS / Trigger denies permission with error code 42501.
- **Private Proxy Snooping:** Authenticated `buyer_1` attempts to query `max_amount` of `buyer_2` from `bids`. Verify column returns `NULL` or row is filtered out.
- **Seller Self-Bidding:** Authenticated `seller` attempts to place a bid on their own lot. Verify `place_bid` RPC raises exception and rejects bid.

---

## 3. Accessibility (WCAG 2.2 AA) & Visual Quality Assurance

- **Screen-Reader Compatibility:** Real-time auction bids trigger `aria-live="polite"` or `"assertive"` announcements for screen readers.
- **Keyboard Navigation:** Full tab navigation across all modals, drawers, bidding increments, and media galleries.
- **3D Fallbacks:** Users with WebGL disabled or slow networks receive a high-resolution 360-degree photography carousel with full keyboard zoom and pan controls.
- **Responsive Viewports Tested:**
  - Mobile Portrait: 375x667 (iPhone SE), 390x844 (iPhone 14)
  - Mobile Landscape: 844x390
  - Tablet: 768x1024 (iPad Mini), 820x1180 (iPad Air)
  - Desktop: 1280x720 (HD), 1440x900 (MacBook), 1920x1080 (FHD)
