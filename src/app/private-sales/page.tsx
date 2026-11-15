"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Shield,
  Key,
  Landmark,
  EyeOff,
  UserCheck,
  Building2,
  Mail,
  CheckCircle2,
  ArrowRight,
  Clock,
} from "lucide-react";

export default function PrivateSalesPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    mandate: "acquisition",
    department: "fine-art",
    budgetRange: "cr-1-5",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-luxury-black text-luxury-ivory flex flex-col justify-between selection:bg-luxury-gold selection:text-black">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex-1 w-full">
        {/* Hero Section */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1 rounded-sm bg-luxury-dark border border-luxury-gold/50 text-luxury-gold">
              <Key size={16} />
            </span>
            <span className="text-[10px] uppercase tracking-luxury text-luxury-gold font-semibold">
              Discreet Client Advisory
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-luxury-ivory font-light leading-tight">
            Private Sales & <br />
            Confidential Acquisitions
          </h1>
          <p className="text-sm sm:text-base text-luxury-champagne/80 mt-4 leading-relaxed font-light">
            Outside the public auction calendar, AUCTIONLY facilitates discreet private transactions for museum-quality masterpieces, rare single-owner estates, and historical antiquities.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-luxury-dark border border-luxury-champagne/15 p-8 rounded-sm hover:border-luxury-gold/40 transition-colors">
            <div className="w-12 h-12 rounded-sm bg-luxury-black border border-luxury-gold/40 flex items-center justify-center text-luxury-gold mb-6">
              <EyeOff size={22} />
            </div>
            <h3 className="font-serif text-xl text-luxury-ivory font-medium mb-3">
              Absolute Discretion
            </h3>
            <p className="text-xs text-luxury-champagne/70 leading-relaxed">
              Neither identity nor final transaction price is made public. Transactions are executed under institutional non-disclosure covenants and private escrow.
            </p>
          </div>

          <div className="bg-luxury-dark border border-luxury-champagne/15 p-8 rounded-sm hover:border-luxury-gold/40 transition-colors">
            <div className="w-12 h-12 rounded-sm bg-luxury-black border border-luxury-gold/40 flex items-center justify-center text-luxury-gold mb-6">
              <Landmark size={22} />
            </div>
            <h3 className="font-serif text-xl text-luxury-ivory font-medium mb-3">
              Bespoke Sourcing
            </h3>
            <p className="text-xs text-luxury-champagne/70 leading-relaxed">
              Looking for a specific period Tyeb Mehta, a rare royal jade huqqa base, or an unpolished vintage Patek Philippe? Our global advisory scours private collections worldwide.
            </p>
          </div>

          <div className="bg-luxury-dark border border-luxury-champagne/15 p-8 rounded-sm hover:border-luxury-gold/40 transition-colors">
            <div className="w-12 h-12 rounded-sm bg-luxury-black border border-luxury-gold/40 flex items-center justify-center text-luxury-gold mb-6">
              <Building2 size={22} />
            </div>
            <h3 className="font-serif text-xl text-luxury-ivory font-medium mb-3">
              Private Viewing Salons
            </h3>
            <p className="text-xs text-luxury-champagne/70 leading-relaxed">
              Arrange private viewings in our secured salons in Mumbai, New Delhi, or London with certified specialists on hand to review provenance and condition dossiers.
            </p>
          </div>
        </div>

        {/* Mandate Consultation Form */}
        <div className="bg-gradient-to-r from-luxury-dark via-luxury-black to-luxury-dark border border-luxury-gold/40 rounded-sm p-8 sm:p-12 mb-16">
          <div className="max-w-2xl mx-auto">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-luxury-black border border-luxury-gold flex items-center justify-center text-luxury-gold mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-serif text-2xl text-luxury-ivory font-normal mb-2">
                  Advisory Mandate Registered
                </h3>
                <p className="text-xs text-luxury-champagne/80 max-w-md mx-auto leading-relaxed mb-6">
                  A Senior Private Client Director will contact you confidentially within 24 hours to schedule a consultation.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="py-2.5 px-6 bg-luxury-gold text-luxury-black text-xs uppercase tracking-luxury font-semibold hover:bg-luxury-gold-hover transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <span className="text-[10px] uppercase tracking-luxury text-luxury-gold font-semibold block mb-1">
                    Direct Curatorial Access
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-luxury-ivory font-light">
                    Initiate a Private Advisory Mandate
                  </h2>
                  <p className="text-xs text-luxury-champagne/70 mt-2">
                    All inquiries are held in strict legal confidence.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-luxury text-luxury-champagne mb-1 font-medium">
                        Collector / Representative Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. S. Singhania"
                        className="w-full bg-luxury-black border border-luxury-subtle px-3.5 py-2.5 text-xs text-luxury-ivory focus:border-luxury-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-luxury text-luxury-champagne mb-1 font-medium">
                        Confidential Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="client@familyoffice.in"
                        className="w-full bg-luxury-black border border-luxury-subtle px-3.5 py-2.5 text-xs text-luxury-ivory focus:border-luxury-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-luxury text-luxury-champagne mb-1 font-medium">
                        Mandate Type
                      </label>
                      <select
                        value={formData.mandate}
                        onChange={(e) => setFormData({ ...formData, mandate: e.target.value })}
                        className="w-full bg-luxury-black border border-luxury-subtle px-3 py-2.5 text-xs text-luxury-ivory focus:border-luxury-gold focus:outline-none"
                      >
                        <option value="acquisition">Private Acquisition</option>
                        <option value="deaccession">Private Deaccession (Sale)</option>
                        <option value="estate">Estate Planning & Advisory</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-luxury text-luxury-champagne mb-1 font-medium">
                        Department Focus
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full bg-luxury-black border border-luxury-subtle px-3 py-2.5 text-xs text-luxury-ivory focus:border-luxury-gold focus:outline-none"
                      >
                        <option value="fine-art">Modern & Contemporary Fine Art</option>
                        <option value="antiques">Classical Antiquities & Bronzes</option>
                        <option value="watches-jewellery">High Horology & Jewels</option>
                        <option value="numismatics">Rare Coins & Medals</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-luxury text-luxury-champagne mb-1 font-medium">
                        Anticipated Capital (INR)
                      </label>
                      <select
                        value={formData.budgetRange}
                        onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                        className="w-full bg-luxury-black border border-luxury-subtle px-3 py-2.5 text-xs text-luxury-ivory focus:border-luxury-gold focus:outline-none"
                      >
                        <option value="lakh-50-cr-1">₹50 Lakhs - ₹1 Crore</option>
                        <option value="cr-1-5">₹1 Crore - ₹5 Crores</option>
                        <option value="cr-5-plus">₹5 Crores + (Institutional Tier)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-luxury text-luxury-champagne mb-1 font-medium">
                      Specific Object or Artist Interest
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Describe the period, artist, provenance, or specific work you are seeking to acquire or place..."
                      className="w-full bg-luxury-black border border-luxury-subtle p-3 text-xs text-luxury-ivory focus:border-luxury-gold focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3.5 bg-luxury-gold hover:bg-luxury-gold-hover text-luxury-black font-semibold uppercase tracking-luxury text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <span>Request Confidential Consultation</span>
                    <ArrowRight size={14} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
