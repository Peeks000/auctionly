"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Landmark,
  ShieldCheck,
  ArrowRight,
  Upload,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  AlertCircle,
} from "lucide-react";

export default function ValuationPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "Mumbai",
    department: "fine-art",
    title: "",
    artistOrMaker: "",
    period: "",
    provenanceHistory: "",
    expectedValuation: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      const generatedRef = "VAL-" + Math.floor(100000 + Math.random() * 900000);
      setReferenceId(generatedRef);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-luxury-black text-luxury-ivory flex flex-col justify-between selection:bg-luxury-gold selection:text-black">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-luxury-champagne/15">
          <Link
            href="/studio"
            className="text-xs uppercase tracking-luxury text-luxury-champagne hover:text-luxury-gold transition-colors"
          >
            ← Return to Consignor Studio
          </Link>
          <span className="text-[11px] text-luxury-gold font-mono uppercase">
            Specialist Appraisal Desk
          </span>
        </div>

        {/* Page Heading */}
        <div className="max-w-2xl mb-12">
          <span className="text-[10px] uppercase tracking-luxury text-luxury-gold font-semibold block mb-2">
            Complimentary Curatorial Valuation
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-luxury-ivory font-light leading-tight">
            Specialist Auction Appraisal & Estimate
          </h1>
          <p className="text-xs sm:text-sm text-luxury-champagne/70 mt-3 leading-relaxed">
            Submit your fine art, timepieces, royal heirlooms, or numismatic collections for an authoritative curatorial assessment by our department specialists within 48 hours.
          </p>
        </div>

        {/* Form or Confirmation */}
        {submitted ? (
          <div className="bg-luxury-dark border border-luxury-gold/50 rounded-sm p-10 text-center max-w-xl mx-auto my-8 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-luxury-black border border-luxury-gold flex items-center justify-center text-luxury-gold mx-auto mb-5">
              <CheckCircle2 size={32} />
            </div>
            <span className="text-[10px] uppercase tracking-luxury text-luxury-gold font-semibold block mb-1">
              Valuation Request Recorded
            </span>
            <h2 className="font-serif text-2xl text-luxury-ivory font-normal mb-2">
              Dossier Reference: {referenceId}
            </h2>
            <p className="text-xs text-luxury-champagne/80 mb-6 leading-relaxed">
              Our Senior Curators for {formData.department.replace("-", " ").toUpperCase()} have received your appraisal submission. You will receive an initial curatorial review and market estimate at <strong className="text-luxury-ivory">{formData.email}</strong> within two business days.
            </p>

            <div className="bg-luxury-black p-4 rounded-sm border border-luxury-champagne/15 text-left text-xs mb-8 space-y-1.5">
              <div><strong className="text-luxury-gold">Item:</strong> {formData.title}</div>
              {formData.artistOrMaker && <div><strong className="text-luxury-gold">Attribution:</strong> {formData.artistOrMaker}</div>}
              <div><strong className="text-luxury-gold">Specialist City Desk:</strong> {formData.city}</div>
              <div><strong className="text-luxury-gold">Confidentiality:</strong> Covered under AUCTIONLY Private Client NDA</div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setSubmitted(false)}
                className="py-2.5 px-5 bg-luxury-black border border-luxury-champagne/30 text-xs uppercase tracking-luxury text-luxury-champagne hover:text-luxury-ivory transition-colors"
              >
                Submit Another Valuation
              </button>
              <Link
                href="/studio"
                className="py-2.5 px-5 bg-luxury-gold text-luxury-black text-xs uppercase tracking-luxury font-semibold hover:bg-luxury-gold-hover transition-colors"
              >
                Go to Consignor Studio
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Form Column */}
            <div className="lg:col-span-2 bg-luxury-dark border border-luxury-champagne/20 rounded-sm p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <h3 className="font-serif text-lg text-luxury-ivory font-medium border-b border-luxury-subtle/50 pb-2 mb-4">
                    1. Object & Attribution Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] uppercase tracking-luxury text-luxury-champagne mb-1 font-medium">
                        Object Title / Description *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. 19th Century Tanjore Glass Painting of Krishna"
                        className="w-full bg-luxury-black border border-luxury-subtle px-3.5 py-2.5 text-xs text-luxury-ivory focus:border-luxury-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-luxury text-luxury-champagne mb-1 font-medium">
                        Department Category *
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full bg-luxury-black border border-luxury-subtle px-3 py-2.5 text-xs text-luxury-ivory focus:border-luxury-gold focus:outline-none"
                      >
                        <option value="fine-art">Fine Art & Paintings</option>
                        <option value="sculptures">Sculptures & Decorative Art</option>
                        <option value="antiques">Antiques & Historical Objects</option>
                        <option value="numismatics">Coins & Numismatics</option>
                        <option value="watches-jewellery">Watches & Jewellery</option>
                        <option value="rare-books">Rare Books & Manuscripts</option>
                        <option value="vintage-design">Vintage Design</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-luxury text-luxury-champagne mb-1 font-medium">
                        Artist, Maker or Dynasty
                      </label>
                      <input
                        type="text"
                        value={formData.artistOrMaker}
                        onChange={(e) => setFormData({ ...formData, artistOrMaker: e.target.value })}
                        placeholder="e.g. Raja Ravi Varma / Patek Philippe"
                        className="w-full bg-luxury-black border border-luxury-subtle px-3.5 py-2.5 text-xs text-luxury-ivory focus:border-luxury-gold focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] uppercase tracking-luxury text-luxury-champagne mb-1 font-medium">
                        Known Provenance & Acquisition History
                      </label>
                      <textarea
                        rows={3}
                        value={formData.provenanceHistory}
                        onChange={(e) => setFormData({ ...formData, provenanceHistory: e.target.value })}
                        placeholder="Inherited from ancestral estate, purchased from gallery in 1982, exhibition stickers, signed paperwork..."
                        className="w-full bg-luxury-black border border-luxury-subtle p-3 text-xs text-luxury-ivory focus:border-luxury-gold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-lg text-luxury-ivory font-medium border-b border-luxury-subtle/50 pb-2 mb-4">
                    2. Valuation Expectations
                  </h3>
                  <div>
                    <label className="block text-[11px] uppercase tracking-luxury text-luxury-champagne mb-1 font-medium">
                      Estimated Market Value or Target Reserve (INR ₹)
                    </label>
                    <input
                      type="text"
                      value={formData.expectedValuation}
                      onChange={(e) => setFormData({ ...formData, expectedValuation: e.target.value })}
                      placeholder="e.g. ₹25,00,000"
                      className="w-full bg-luxury-black border border-luxury-subtle px-3.5 py-2.5 text-xs text-luxury-ivory focus:border-luxury-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-lg text-luxury-ivory font-medium border-b border-luxury-subtle/50 pb-2 mb-4">
                    3. Contact & Representation
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-luxury text-luxury-champagne mb-1 font-medium">
                        Full Name / Representative *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Your full name"
                        className="w-full bg-luxury-black border border-luxury-subtle px-3.5 py-2.5 text-xs text-luxury-ivory focus:border-luxury-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-luxury text-luxury-champagne mb-1 font-medium">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="client@domain.com"
                        className="w-full bg-luxury-black border border-luxury-subtle px-3.5 py-2.5 text-xs text-luxury-ivory focus:border-luxury-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-luxury text-luxury-champagne mb-1 font-medium">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98200 00000"
                        className="w-full bg-luxury-black border border-luxury-subtle px-3.5 py-2.5 text-xs text-luxury-ivory focus:border-luxury-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-luxury text-luxury-champagne mb-1 font-medium">
                        Preferred Specialist Desk
                      </label>
                      <select
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-luxury-black border border-luxury-subtle px-3 py-2.5 text-xs text-luxury-ivory focus:border-luxury-gold focus:outline-none"
                      >
                        <option value="Mumbai">Mumbai (Colaba)</option>
                        <option value="New Delhi">New Delhi (Sundar Nagar)</option>
                        <option value="Bengaluru">Bengaluru (Lavelle Rd)</option>
                        <option value="London">London (Mayfair)</option>
                        <option value="New York">New York (Madison Ave)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-luxury-gold hover:bg-luxury-gold-hover text-luxury-black font-semibold uppercase tracking-luxury text-xs flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 mt-2"
                >
                  <span>{submitting ? "Transmitting Dossier..." : "Request Specialist Valuation"}</span>
                  <ArrowRight size={15} />
                </button>
              </form>
            </div>

            {/* Information Column */}
            <div className="flex flex-col gap-6">
              <div className="bg-luxury-dark border border-luxury-gold/30 p-6 rounded-sm">
                <div className="flex items-center gap-2 text-luxury-gold mb-3">
                  <Award size={18} />
                  <h4 className="font-serif text-sm uppercase tracking-wider font-semibold">
                    The AUCTIONLY Advantage
                  </h4>
                </div>
                <ul className="space-y-3 text-xs text-luxury-champagne/80">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-luxury-gold shrink-0 mt-0.5" />
                    <span>Competitive consignor commissions (starting at 6% for premier lots).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-luxury-gold shrink-0 mt-0.5" />
                    <span>Global exposure to verified high-net-worth institutional collectors.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-luxury-gold shrink-0 mt-0.5" />
                    <span>Complimentary museum-standard photography and 3D photogrammetry.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-luxury-gold shrink-0 mt-0.5" />
                    <span>Comprehensive transit and exhibition insurance included.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-luxury-dark/40 border border-luxury-champagne/15 p-6 rounded-sm">
                <div className="flex items-center gap-2 text-luxury-champagne mb-2">
                  <Clock size={16} className="text-luxury-gold" />
                  <h4 className="text-xs uppercase tracking-luxury font-medium text-luxury-ivory">
                    Valuation Timeline
                  </h4>
                </div>
                <p className="text-[11px] text-luxury-champagne/70 leading-relaxed">
                  Preliminary reviews are returned within 48 hours. If selected for an upcoming gala sale, our logistics team will coordinate physical inspection and transit.
                </p>
              </div>

              <div className="border border-luxury-subtle/50 p-4 text-[11px] text-luxury-muted flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                <span>All valuation requests are protected by institutional confidentiality.</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
