# AUCTIONLY — Threat Model, Role Matrix & Application Security

**Classification:** High-Assurance Financial & Luxury Marketplace Architecture  
**Standards:** OWASP Top 10, STRIDE Threat Modeling, ISO/IEC 27001 Guidelines, SOC 2 Type II Principles  

---

## 1. Role-Based Access Control (RBAC) Matrix

AUCTIONLY defines 10 granular roles with strict privilege separation:

| Role | Browse & Search | Place Bid / Buy | Consign Lot | Moderate Listings | Live Hammer Down | Settle Payouts | Audit Logs | Manage Users | System Config |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Visitor** | Yes | No | No | No | No | No | No | No | No |
| **Buyer** | Yes | Yes (Verified) | No | No | No | No | No | No | No |
| **Seller** | Yes | Yes | Yes (Draft/Submit) | No | No | No | No | No | No |
| **Auctioneer** | Yes | Yes | No | View Only | Yes | No | No | No | No |
| **Moderator** | Yes | No | No | Approve/Reject | No | No | No | Flag Users | No |
| **Specialist** | Yes | No | No | Authenticate | No | No | No | No | No |
| **Support** | Yes | No | No | View Only | No | View Disputes | No | Assist | No |
| **Finance** | Yes | No | No | No | No | Approve/Execute| View | No | No |
| **Administrator** | Yes | Yes | Yes | All Standard | Supervise | View | View | Manage | Flags |
| **Super Admin** | Yes | Yes | Yes | Full Control | Full Control | Full Control | Full Control | Full Control | Full Control |

---

## 2. Super Admin Bootstrap & Privilege Escalation Defenses

### 2.1 The Vulnerability of Naive Setups
Many web applications mistakenly grant administrative privileges to the first registered user or expose role toggles on public profiles. In a luxury auction environment managing crores in transactions, this would be catastrophic.

### 2.2 The AUCTIONLY Bootstrap Protocol
1. **Zero Public Self-Escalation:** The `profiles` table has a Postgres trigger (`prevent_role_escalation`) that rejects any `UPDATE` modifying the `role` column unless executed by an authenticated `super_admin` or via the secure server-side bootstrap routine.
2. **One-Time Bootstrap Token:**
   - On first deployment, a single-use cryptographically random token (`SUPER_ADMIN_BOOTSTRAP_KEY`) is generated and placed into the server's private environment variables.
   - A dedicated server-only API endpoint `/api/admin/bootstrap` accepts:
     - The private bootstrap key.
     - The target user email (already registered via Supabase Auth).
     - Multi-factor authentication confirmation.
   - Upon successful execution:
     - The target user's role is upgraded to `super_admin`.
     - An immutable record is written to `super_admin_bootstrap (initialized = TRUE, initialized_at = NOW(), initialized_by = ip)`.
     - Any future call to `/api/admin/bootstrap` returns HTTP 410 Gone immediately.

---

## 3. Threat Model (STRIDE Methodology)

| Threat Class | Identified Threat Vector | Impact | Engineering Mitigation |
|---|---|---|---|
| **Spoofing** | Adversary attempts to place bids posing as high-net-worth collector. | False auction inflation, defaulted wins. | Mandatory phone OTP and ID verification before high-value bids. Supabase Auth JWT validated server-side. |
| **Tampering** | Malicious bidder modifies client payload to alter `current_price` or timestamps. | Corrupted auction state, stolen lots. | Server-authoritative engine. Client only sends `p_max_amount`. Clock is strictly PostgreSQL `NOW()`. |
| **Repudiation** | Winning bidder claims they never placed the hammer bid. | Unsettled transactions, legal disputes. | Immutable `bids` ledger with user ID, IP hash, user-agent, timestamp, and cryptographic transaction receipt. |
| **Information Disclosure** | Competitor discovers another bidder's maximum proxy ceiling. | Shill bidding up to 1 paisa below proxy. | `max_amount` protected by Postgres RLS: visible strictly to the owning bidder. Hashed aliases on public boards. |
| **Denial of Service** | Bot spams bidding endpoint during final seconds of auction. | Server failure, sniped legitimate bids. | Anti-sniping dynamic extension (soft close); Redis/Memory sliding window rate limiting on bid submissions. |
| **Elevation of Privilege** | Buyer updates their profile record to `role = 'administrator'`. | Complete system compromise. | Strict RLS: `profiles.role` updates denied to non-Super Admin users via PostgreSQL security trigger. |

---

## 4. Payment Gateway & Webhook Signature Hardening

1. **No Client Trust:** The frontend checkout screen is never accepted as payment confirmation.
2. **Cryptographic Signature Verification:**
   - Every Razorpay payment response passes through server-side verification:
   ```typescript
   import crypto from "crypto";
   
   export function verifyRazorpaySignature({
     orderId,
     paymentId,
     signature,
     secret,
   }: {
     orderId: string;
     paymentId: string;
     signature: string;
     secret: string;
   }): boolean {
     const body = orderId + "|" + paymentId;
     const expectedSignature = crypto
       .createHmac("sha256", secret)
       .update(body.toString())
       .digest("hex");
     return crypto.timingSafeEqual(
       Buffer.from(expectedSignature),
       Buffer.from(signature)
     );
   }
   ```
3. **Webhook Idempotency:**
   - Webhook payloads include an `event_id`.
   - Before executing order status updates, the server checks `processed_events` table. Duplicate webhook deliveries are acknowledged with HTTP 200 without re-triggering fulfillment or ledger changes.

---

## 5. Input Validation & Defense in Depth
- All server actions and API route handlers parse inputs through strict **Zod** schemas.
- Database enforces integer limits (`BIGINT`), regex constraints on phone numbers/GSTIN/PAN, and foreign key cascades.
- Content Security Policy (CSP) headers block unauthorized external scripts and framing.
