# AUCTIONLY — Free-Tier Cost & Resource Register

**Policy:** Zero Unapproved Spend  
**Monthly Operating Cost Target:** ₹0.00 / \$0.00  

---

## 1. Free-Tier Infrastructure Inventory

| Service | Plan / Tier | Allocated Quota | Expected Beta Usage | Upgrade Trigger (Requires User Approval) | Cost if Exceeded |
|---|---|---|---|---|---|
| **Netlify / Vercel** | Free Hobby | 100 GB Bandwidth / mo<br>100k Function Invocations | ~15 GB Bandwidth<br>~25k Invocations | Exceeding 100 GB Bandwidth | Service pauses or auto-stops (No automatic upgrade allowed) |
| **Supabase** | Free Plan | 500 MB PostgreSQL<br>1 GB File Storage<br>200 Realtime Connections | ~40 MB Database<br>~300 MB Storage<br>~30 Concurrent Users | Database reaching 450 MB | Never auto-upgrade; run data archiving script |
| **Razorpay** | Test Mode | Unlimited sandbox API calls<br>Zero transaction fees | ~500 test transactions | Moving to Live Mode | Requires corporate KYC & merchant account approval |
| **AI Intelligence** | Local / Free Tier | Local Ollama (Free)<br>HuggingFace/Gemini Free | ~5,000 queries | High volume production demand | Never activate paid API without explicit human approval |
| **GitHub** | Public Repository | Free public actions (2,000 min/mo)<br>Free unlimited public storage | ~200 CI minutes/mo | Private repository conversion | Public repository keeps CI 100% free |

---

## 2. Spend Guardrails & Inviolable Rules
1. **No Credit Cards Bound to Auto-Charge:** No automated billing or auto-recharge settings enabled.
2. **Hard Spending Limit:** \$0.00.
3. **No Paid Add-ons:** No paid domains, no paid SSL certificates (Let's Encrypt / platform certificates used), no paid SMS gateways (mock/in-app OTP used in beta).
4. **Transparent Alerting:** If any resource approaches 80% of free-tier allocation, the system logs a high-priority notice for administrative review.
