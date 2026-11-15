# AUCTIONLY — Free-Tier Deployment & DevOps Strategy

**Target Platform:** Netlify Free / Vercel Free + Supabase Free  
**Deployment URL:** Provider-generated subdomain (Zero custom domain expense)  
**Cost Target:** \$0.00 / month (Zero unapproved spend)  

---

## 1. Hosting Provider Analysis & Selection

| Provider | Next.js 15 App Router Support | Free Bandwidth | Serverless Functions | Edge Middleware | Recommendation | Status |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Vercel Free** | Native (Creator of Next.js) | 100 GB / month | Fast cold starts | Included | **Deployed in 41s** | **Active Production** |
| **Netlify Free** | Yes (`@netlify/plugin-nextjs`) | 100 GB / month | 125k requests / mo | Included | **Supported** | Configured (`netlify.toml`) |

### Netlify Deployment Configuration (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"
```

---

## 2. Supabase Free Tier Configuration & Quota Management

- **Database Size:** 500 MB (More than sufficient for 100,000+ listings and millions of bid records).
- **Storage Size:** 1 GB free file storage (glTF models and primary images optimized under 2MB each).
- **Realtime Quota:** 200 concurrent connections, 2 million messages/month (Adequate for private beta).
- **Project Inactivity Protection:** Supabase pauses free projects after 7 days of inactivity. An automated health ping will be documented for active beta periods.

---

## 3. Environment Variable Configuration Matrix

The following environment variables must be configured in the deployment environment:

| Variable Name | Environment | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public (Client + Server) | Supabase project API gateway URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public (Client + Server) | Client-side anon key restricted by RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | **Private (Server Only)** | Privileged backend worker key (NEVER in browser) |
| `SUPER_ADMIN_BOOTSTRAP_KEY` | **Private (Server Only)** | Single-use secret token for initial admin setup |
| `NEXT_PUBLIC_APP_URL` | Public (Client + Server) | Canonical URL for auth redirects |
| `RAZORPAY_KEY_ID` | Public / Server | Razorpay test mode Key ID |
| `RAZORPAY_KEY_SECRET` | **Private (Server Only)** | Razorpay test mode Secret for signature checks |
| `RAZORPAY_WEBHOOK_SECRET` | **Private (Server Only)** | Secret to verify webhook payload HMAC |

---

## 4. Pre-Flight Release Checklist
1. All database migrations applied to Supabase PostgreSQL.
2. Row Level Security (RLS) enabled on all 14 tables.
3. Super Admin bootstrap token generated and stored in server environment.
4. Next.js production build completes with zero TypeScript errors (`tsc --noEmit`).
5. All sensitive credentials excluded from Git via `.gitignore`.
6. Live deployment opened and verified on desktop and mobile viewports.
