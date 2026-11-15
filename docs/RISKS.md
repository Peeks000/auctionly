# AUCTIONLY — Risk Register & Mitigation Strategy

---

## 1. Risk Matrix

| Risk ID | Risk Description | Severity | Likelihood | Mitigation Strategy | Contingency Plan |
|---|---|:---:|:---:|---|---|
| **RSK-01** | Bidding race conditions corrupt high bidder during final seconds. | Critical | Medium | PostgreSQL atomic row locking (`FOR UPDATE`) inside `place_bid` RPC function. All updates execute in a single serial transaction. | In the event of locking timeout, bid is rejected with a clear "Bid out of sequence, please retry" alert. |
| **RSK-02** | Simultaneous Buy Now and auction hammer causes double sale. | Critical | Low | Listing `inventory_status` column changes atomically via conditional `UPDATE ... WHERE inventory_status = 'available'`. | Secondary check before order creation; immediate refund trigger if conflict occurs. |
| **RSK-03** | Super Admin privilege escalation via public API or client manipulation. | Critical | Low | Role column strictly protected by Postgres security trigger. Admin bootstrap requires one-time cryptographically random server token. | Instant system alert to security log; immediate session revocation. |
| **RSK-04** | Client clock manipulation allows late bids after auction end time. | High | High | Server-authoritative time strictly enforced via database `NOW()`. Client browser timestamps are ignored. | Client displays synchronized server time via heartbeat ping. |
| **RSK-05** | Webhook replay attacks cause double invoicing or payout credit. | High | Medium | Webhook handler checks `processed_events` table for unique `event_id` before executing business logic. | Duplicate webhooks return HTTP 200 without state mutation. |
| **RSK-06** | 3D WebGL crashes or fails on low-end mobile devices. | Medium | High | Automatic WebGL capability detection. Graceful fallback to high-res 360-degree photography carousel. | Product information and bidding panel remain 100% accessible without 3D canvas. |
| **RSK-07** | Free-tier cloud resource limits exceeded (e.g., Supabase 500MB DB). | Medium | Low | Media assets stored in external compressed storage or CDN. Asset uploads capped at 25MB. Database indexes optimized. | Inactivity ping keeps Supabase active; data export script ready. |
| **RSK-08** | AI Concierge hallucinates non-existent lots or guarantees authenticity. | High | Medium | System prompt strictly fences AI knowledge to current database catalog. Hard guardrails forbid authenticity certification. | Deterministic fallback responses if AI confidence is low. |
| **RSK-09** | Shill bidding by sellers on their own lots to inflate prices. | High | Medium | Database constraint forbids `seller_id = bidder_id`. Linked IP and device fingerprinting alerts in Admin desk. | Administrative suspension of flagged accounts and bid invalidation. |
