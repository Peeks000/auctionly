"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LogoWordmark from "@/components/brand/LogoWordmark";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  UserCheck,
  KeyRound,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  const handleDemoCollectorLogin = () => {
    setLoading(true);
    setMessage({ type: "info", text: "Authenticating VIP Collector profile (Vikramaditya Singhania)..." });
    setTimeout(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "auctionly_user",
          JSON.stringify({
            id: "usr_vip_001",
            name: "Vikramaditya Singhania",
            email: "vikramaditya@singhania-heritage.in",
            role: "vip_collector",
            kycVerified: true,
            tier: "Grand Collector",
          })
        );
      }
      setMessage({ type: "success", text: "Authenticated successfully. Redirecting to Collector Dashboard..." });
      setTimeout(() => {
        router.push("/dashboard");
      }, 700);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    setTimeout(() => {
      setLoading(false);
      if (mode === "register") {
        if (!invitationCode) {
          setMessage({
            type: "info",
            text: "Private Beta Registration: Account created with VIP Guest privileges. Full bidding requires verification.",
          });
        }
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "auctionly_user",
            JSON.stringify({
              id: "usr_" + Math.random().toString(36).substring(2, 9),
              name: fullName || "Patron Collector",
              email: email || "collector@auctionly.in",
              role: "collector",
              kycVerified: false,
              tier: "Patron Member",
            })
          );
        }
        setTimeout(() => router.push("/dashboard"), 900);
      } else {
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "auctionly_user",
            JSON.stringify({
              id: "usr_active",
              name: email.split("@")[0].toUpperCase() || "Verified Collector",
              email: email || "collector@auctionly.in",
              role: "collector",
              kycVerified: true,
              tier: "Active Bidder",
            })
          );
        }
        setMessage({ type: "success", text: "Welcome back. Redirecting to your dashboard..." });
        setTimeout(() => router.push("/dashboard"), 800);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-luxury-black text-luxury-ivory flex flex-col justify-between selection:bg-luxury-gold selection:text-black">
      {/* Top Bar */}
      <div className="border-b border-luxury-subtle/40 bg-luxury-dark/60 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <LogoWordmark showTagline={false} monogramSize={28} />
          </Link>
          <div className="flex items-center gap-2 text-[11px] text-luxury-champagne">
            <ShieldCheck size={14} className="text-luxury-gold" />
            <span className="uppercase tracking-wider">Private Beta Access Portal</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-md w-full mx-auto px-4 py-12 flex-1 flex flex-col justify-center">
        <div className="bg-luxury-dark border border-luxury-gold/30 rounded-sm shadow-2xl p-8 backdrop-blur-md relative overflow-hidden">
          {/* Subtle gold accent top line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent" />

          {/* Heading */}
          <div className="text-center mb-8">
            <span className="text-[10px] uppercase tracking-luxury text-luxury-gold font-semibold block mb-2">
              Privileged Portal
            </span>
            <h1 className="font-serif text-2xl md:text-3xl text-luxury-ivory font-light">
              {mode === "signin" ? "Collector Sign In" : "Request Bidder Access"}
            </h1>
            <p className="text-xs text-luxury-champagne/70 mt-2">
              Authoritative bidding on curated fine art and historical antiquities.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex border-b border-luxury-subtle mb-6 text-xs uppercase tracking-luxury">
            <button
              onClick={() => {
                setMode("signin");
                setMessage(null);
              }}
              className={`flex-1 py-2.5 text-center font-medium transition-all ${
                mode === "signin"
                  ? "text-luxury-gold border-b-2 border-luxury-gold"
                  : "text-luxury-muted hover:text-luxury-ivory"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode("register");
                setMessage(null);
              }}
              className={`flex-1 py-2.5 text-center font-medium transition-all ${
                mode === "register"
                  ? "text-luxury-gold border-b-2 border-luxury-gold"
                  : "text-luxury-muted hover:text-luxury-ivory"
              }`}
            >
              Join Private Beta
            </button>
          </div>

          {/* Feedback messages */}
          {message && (
            <div
              className={`mb-5 p-3 rounded-sm text-xs flex items-start gap-2.5 border ${
                message.type === "success"
                  ? "bg-emerald-950/60 border-emerald-800 text-emerald-200"
                  : message.type === "error"
                  ? "bg-red-950/60 border-red-800 text-red-200"
                  : "bg-luxury-gold/10 border-luxury-gold/40 text-luxury-gold"
              }`}
            >
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{message.text}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "register" && (
              <div>
                <label className="block text-[11px] uppercase tracking-luxury text-luxury-champagne mb-1.5 font-medium">
                  Full Name / Institution
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Maharaja Sawai Art Foundation"
                  className="w-full bg-luxury-black border border-luxury-subtle px-3.5 py-2.5 text-xs text-luxury-ivory placeholder-luxury-muted focus:border-luxury-gold focus:outline-none transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-luxury-champagne mb-1.5 font-medium">
                Collector Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="collector@domain.com"
                  className="w-full bg-luxury-black border border-luxury-subtle pl-10 pr-3.5 py-2.5 text-xs text-luxury-ivory placeholder-luxury-muted focus:border-luxury-gold focus:outline-none transition-colors"
                />
                <Mail size={15} className="absolute left-3.5 top-3 text-luxury-muted" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-luxury-champagne mb-1.5 font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-luxury-black border border-luxury-subtle pl-10 pr-3.5 py-2.5 text-xs text-luxury-ivory placeholder-luxury-muted focus:border-luxury-gold focus:outline-none transition-colors"
                />
                <Lock size={15} className="absolute left-3.5 top-3 text-luxury-muted" />
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-[11px] uppercase tracking-luxury text-luxury-champagne mb-1.5 font-medium">
                  Private Beta Invitation Code (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={invitationCode}
                    onChange={(e) => setInvitationCode(e.target.value)}
                    placeholder="e.g. VIP-AUCTIONLY-2026"
                    className="w-full bg-luxury-black border border-luxury-subtle pl-10 pr-3.5 py-2.5 text-xs text-luxury-ivory placeholder-luxury-muted focus:border-luxury-gold focus:outline-none transition-colors uppercase tracking-wider"
                  />
                  <KeyRound size={15} className="absolute left-3.5 top-3 text-luxury-gold" />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3 bg-luxury-gold hover:bg-luxury-gold-hover text-luxury-black font-semibold uppercase tracking-luxury text-xs flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
            >
              <span>{loading ? "Verifying Credentials..." : mode === "signin" ? "Sign In to Auction Room" : "Submit Access Request"}</span>
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 relative flex items-center justify-center">
            <div className="border-t border-luxury-subtle/50 w-full" />
            <span className="bg-luxury-dark px-3 text-[10px] uppercase tracking-widest text-luxury-muted shrink-0">
              Demonstration & Fast Access
            </span>
          </div>

          {/* Quick VIP Demo Login Button */}
          <button
            onClick={handleDemoCollectorLogin}
            disabled={loading}
            className="w-full py-2.5 px-3 bg-luxury-black/80 border border-luxury-gold/50 hover:border-luxury-gold text-luxury-champagne hover:text-luxury-ivory text-xs flex items-center justify-center gap-2 rounded-sm transition-all group"
          >
            <Sparkles size={14} className="text-luxury-gold group-hover:rotate-12 transition-transform" />
            <span className="font-medium">One-Click VIP Collector Login (Vikramaditya)</span>
          </button>

          <p className="mt-4 text-center text-[10px] text-luxury-muted">
            By signing in, you agree to AUCTIONLY’s{" "}
            <Link href="/policies/terms" className="text-luxury-champagne underline hover:text-luxury-gold">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/policies/buyer-agreement" className="text-luxury-champagne underline hover:text-luxury-gold">
              Buyer Conditions
            </Link>
            .
          </p>
        </div>

        {/* Advisory Strip */}
        <div className="mt-6 text-center text-xs text-luxury-muted flex items-center justify-center gap-2">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>Bank-Grade TLS & SHA-256 Encrypted Session</span>
        </div>
      </div>

      {/* Minimal Footer */}
      <div className="border-t border-luxury-subtle/30 py-4 text-center text-[11px] text-luxury-muted">
        AUCTIONLY © 2026 • Curated Luxury & Authoritative INR Settlement
      </div>
    </div>
  );
}
