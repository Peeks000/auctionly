# AUCTIONLY — External Integrations & Fallback Adapters

---

## 1. Razorpay Payment Gateway (Test Mode)

- **Mode:** Strictly Test Mode (`rzp_test_...`). Live Mode requires explicit human approval.
- **Workflow:**
  1. Client triggers checkout for Won Auction or Buy Now lot.
  2. Next.js server route `/api/payments/create-order` creates order via Razorpay REST API with receipt number and amount in paisa.
  3. Razorpay Standard Checkout opens in modal.
  4. Upon completion, client posts `razorpay_payment_id`, `razorpay_order_id`, and `razorpay_signature` to `/api/payments/verify`.
  5. Server cryptographically verifies signature using HMAC-SHA256 with `RAZORPAY_KEY_SECRET`.
  6. Asynchronous webhook (`/api/webhooks/razorpay`) receives `payment.captured` for durable reconciliation.
- **Fallback / Mock Mode:** When Razorpay credentials are not yet configured in `.env.local`, the application seamlessly switches to a clearly labelled **"Test Sandbox Simulation"** mode allowing full testing of the order state machine without crashing.

---

## 2. Supabase Cloud Integration

- **Auth:** Email/Password, Google OAuth, and Phone OTP.
- **Database:** PostgreSQL with Row Level Security, RPC functions for atomic operations.
- **Storage Buckets:**
  - `listing-media`: Public read for images and 3D glTF/GLB models.
  - `verification-documents`: Private read, accessible strictly to Verification Specialists and Super Admins.
  - `invoices`: Private read, accessible to the owning buyer and finance managers.
- **Realtime:** Postgres Changes publication on `auctions`, `bids`, and `messages`.

---

## 3. AI Concierge & Marketplace Intelligence

- **Architecture:** Decoupled Adapter Interface (`AIProviderAdapter`).
- **Implementations:**
  - `OllamaAdapter`: Connects to local Ollama instance (e.g., `qwen2.5:7b` or `mistral`) during local development.
  - `FreeTierHostedAdapter`: Connects to free-tier cloud endpoints (e.g., Gemini Free tier or HuggingFace Inference API).
  - `MockAIAdapter`: High-quality contextual fallback providing deterministic, grounded responses from actual catalog metadata without network dependencies.
- **Guardrails:** AI is strictly forbidden from certifying physical authenticity, declaring valuation guarantees, or placing financial bids.

---

## 4. Live Video & Streaming System

- **Architecture:** Modular streaming adapter (`LiveStreamAdapter`).
- **Production Spec:** WebRTC / HLS streaming player with low-latency feed for the auctioneer.
- **Development Simulation Mode:** Interactive auctioneer video simulation featuring a high-fidelity virtual auction room, audio cues, bid board sync, and manual gavel controls.
