"use client";

import React, { useState } from "react";
import { mockCategories } from "@/lib/data/mockCatalogue";
import { formatINR, parseINRToPaisa } from "@/lib/currency";
import {
  Sparkles,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Box,
  Image as ImageIcon,
} from "lucide-react";

export default function SellerStudioPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    category: "fine-art",
    artist: "",
    period: "",
    materials: "",
    dimensions: "",
    conditionGrade: "Excellent",
    conditionReport: "",
    provenance: "",
    startingPrice: "",
    reservePrice: "",
    buyNowPrice: "",
    saleFormat: "timed_auction",
  });

  const [aiEnhancing, setAiEnhancing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Handle Form Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Simulated AI Description Enhancer (Grounded Seller AI)
  const handleAiEnhance = () => {
    if (!formData.title && !formData.artist) {
      alert("Please enter a title or artist name first.");
      return;
    }
    setAiEnhancing(true);
    setTimeout(() => {
      const generated = `Imperial craftsmanship originating from ${formData.period || "19th century"}. Characterized by master-level execution in ${formData.materials || "traditional materials"}, preserved in ${formData.conditionGrade} state with complete curatorial provenance inspection.`;
      setAiSuggestion(generated);
      setFormData((prev) => ({ ...prev, conditionReport: generated }));
      setAiEnhancing(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedSuccess(true);
  };

  if (submittedSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-luxury-gold/20 border border-luxury-gold flex items-center justify-center text-luxury-gold">
          <CheckCircle2 size={36} />
        </div>
        <h1 className="font-serif text-3xl text-luxury-ivory font-medium">Consignment Submitted for Curatorial Review</h1>
        <p className="text-xs sm:text-sm text-luxury-champagne/80 max-w-md leading-relaxed">
          Your consignment has been securely logged in our database in status <strong className="text-luxury-gold">Pending Review</strong>.
          Our specialist department will review provenance documents and contact you within 24–48 hours.
        </p>
        <button
          onClick={() => {
            setSubmittedSuccess(false);
            setCurrentStep(1);
          }}
          className="px-6 py-3 bg-luxury-gold text-luxury-black font-semibold text-xs uppercase tracking-luxury"
        >
          Submit Another Lot
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">
      {/* Studio Header */}
      <div className="border-b border-luxury-champagne/15 pb-6 flex flex-col gap-2">
        <span className="text-xs uppercase tracking-luxury text-luxury-gold font-medium">Consignment Studio</span>
        <h1 className="font-serif text-3xl text-luxury-ivory font-medium">Submit Exceptional Lot</h1>
        <p className="text-xs text-luxury-champagne/80">
          List your rare art, antiquities, or horology for timed bidding or live gala auctions.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between border-b border-luxury-subtle/40 pb-4 text-xs uppercase tracking-luxury text-luxury-champagne">
        <span className={currentStep === 1 ? "text-luxury-gold font-semibold" : "text-luxury-muted"}>
          1. Lot Metadata
        </span>
        <span className="text-luxury-subtle">•</span>
        <span className={currentStep === 2 ? "text-luxury-gold font-semibold" : "text-luxury-muted"}>
          2. Provenance & Condition
        </span>
        <span className="text-luxury-subtle">•</span>
        <span className={currentStep === 3 ? "text-luxury-gold font-semibold" : "text-luxury-muted"}>
          3. Reserve & Format
        </span>
      </div>

      {/* Step Form */}
      <form onSubmit={handleSubmit} className="card-luxury p-8 flex flex-col gap-6">
        {currentStep === 1 && (
          <div className="flex flex-col gap-6">
            <h3 className="font-serif text-xl text-luxury-ivory font-medium">Department & Object Details</h3>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-luxury text-luxury-champagne">Department</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="bg-luxury-black border border-luxury-champagne/30 p-3 text-xs text-luxury-ivory focus:border-luxury-gold outline-none"
              >
                {mockCategories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-luxury text-luxury-champagne">Lot Title</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. 19th Century Tanjore Miniature Painting"
                value={formData.title}
                onChange={handleChange}
                className="bg-luxury-black border border-luxury-champagne/30 p-3 text-xs text-luxury-ivory focus:border-luxury-gold outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-luxury text-luxury-champagne">Artist / Maker / Atelier</label>
                <input
                  type="text"
                  name="artist"
                  placeholder="e.g. Royal Thanjavur Workshop"
                  value={formData.artist}
                  onChange={handleChange}
                  className="bg-luxury-black border border-luxury-champagne/30 p-3 text-xs text-luxury-ivory focus:border-luxury-gold outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-luxury text-luxury-champagne">Period / Era</label>
                <input
                  type="text"
                  name="period"
                  placeholder="e.g. c. 1860 Maratha Period"
                  value={formData.period}
                  onChange={handleChange}
                  className="bg-luxury-black border border-luxury-champagne/30 p-3 text-xs text-luxury-ivory focus:border-luxury-gold outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-luxury text-luxury-champagne">Materials & Medium</label>
                <input
                  type="text"
                  name="materials"
                  placeholder="e.g. Gold Foil, Teak Board, Natural Pigments"
                  value={formData.materials}
                  onChange={handleChange}
                  className="bg-luxury-black border border-luxury-champagne/30 p-3 text-xs text-luxury-ivory focus:border-luxury-gold outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-luxury text-luxury-champagne">Dimensions</label>
                <input
                  type="text"
                  name="dimensions"
                  placeholder="e.g. 60 x 45 cm"
                  value={formData.dimensions}
                  onChange={handleChange}
                  className="bg-luxury-black border border-luxury-champagne/30 p-3 text-xs text-luxury-ivory focus:border-luxury-gold outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="mt-4 py-3 bg-luxury-gold text-luxury-black font-semibold text-xs uppercase tracking-luxury self-end px-8 hover:bg-luxury-goldLight transition-all"
            >
              Continue to Provenance →
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex flex-col gap-6">
            <h3 className="font-serif text-xl text-luxury-ivory font-medium">Provenance & Condition Assessment</h3>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-luxury text-luxury-champagne">Documented Provenance History</label>
              <textarea
                name="provenance"
                rows={3}
                placeholder="Detail prior ownership history, past gallery records, or auction appearances..."
                value={formData.provenance}
                onChange={handleChange}
                className="bg-luxury-black border border-luxury-champagne/30 p-3 text-xs text-luxury-ivory focus:border-luxury-gold outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-luxury text-luxury-champagne">Condition Report</label>
                <button
                  type="button"
                  onClick={handleAiEnhance}
                  disabled={aiEnhancing}
                  className="text-[11px] text-luxury-gold hover:text-luxury-goldLight flex items-center gap-1 uppercase tracking-wider"
                >
                  <Sparkles size={12} />
                  <span>{aiEnhancing ? "Refining with AI..." : "AI Description Assistant"}</span>
                </button>
              </div>
              <textarea
                name="conditionReport"
                rows={4}
                placeholder="Describe current physical state, signs of aging, restorations..."
                value={formData.conditionReport}
                onChange={handleChange}
                className="bg-luxury-black border border-luxury-champagne/30 p-3 text-xs text-luxury-ivory focus:border-luxury-gold outline-none"
              />
            </div>

            {/* Media Upload Mock Area */}
            <div className="border-2 border-dashed border-luxury-champagne/20 p-8 rounded-sm text-center flex flex-col items-center gap-2 bg-luxury-black/30">
              <UploadCloud size={32} className="text-luxury-gold" />
              <p className="text-xs text-luxury-ivory font-medium">Upload High-Resolution Imagery & 3D Model</p>
              <p className="text-[10px] text-luxury-muted">Supports JPG, PNG, WEBP, and .GLB 3D models (max 25MB)</p>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-xs uppercase tracking-luxury text-luxury-champagne hover:text-luxury-ivory"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="py-3 bg-luxury-gold text-luxury-black font-semibold text-xs uppercase tracking-luxury px-8 hover:bg-luxury-goldLight transition-all"
              >
                Continue to Pricing →
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="flex flex-col gap-6">
            <h3 className="font-serif text-xl text-luxury-ivory font-medium">Sale Format & Reserve Floor</h3>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-luxury text-luxury-champagne">Sale Format</label>
              <select
                name="saleFormat"
                value={formData.saleFormat}
                onChange={handleChange}
                className="bg-luxury-black border border-luxury-champagne/30 p-3 text-xs text-luxury-ivory focus:border-luxury-gold outline-none"
              >
                <option value="timed_auction">Timed Auction (7-Day Duration)</option>
                <option value="live_auction">Request Live Gala Schedule</option>
                <option value="hybrid_auction_buynow">Timed Auction + Buy Now Option</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-luxury text-luxury-champagne">Starting Price (INR ₹)</label>
                <input
                  type="number"
                  name="startingPrice"
                  required
                  placeholder="e.g. 500000"
                  value={formData.startingPrice}
                  onChange={handleChange}
                  className="bg-luxury-black border border-luxury-champagne/30 p-3 text-xs text-luxury-ivory focus:border-luxury-gold outline-none font-mono"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-luxury text-luxury-champagne">Private Reserve Price (INR ₹)</label>
                <input
                  type="number"
                  name="reservePrice"
                  placeholder="e.g. 750000 (Protected Floor)"
                  value={formData.reservePrice}
                  onChange={handleChange}
                  className="bg-luxury-black border border-luxury-champagne/30 p-3 text-xs text-luxury-ivory focus:border-luxury-gold outline-none font-mono"
                />
              </div>
            </div>

            {formData.saleFormat === "hybrid_auction_buynow" && (
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-luxury text-luxury-champagne">Buy Now Price (INR ₹)</label>
                <input
                  type="number"
                  name="buyNowPrice"
                  placeholder="e.g. 1000000 (Instant Purchase)"
                  value={formData.buyNowPrice}
                  onChange={handleChange}
                  className="bg-luxury-black border border-luxury-champagne/30 p-3 text-xs text-luxury-ivory focus:border-luxury-gold outline-none font-mono"
                />
              </div>
            )}

            <div className="p-4 bg-luxury-black/60 border border-luxury-subtle/50 text-xs text-luxury-champagne/80 flex items-start gap-2.5">
              <ShieldCheck size={18} className="text-luxury-gold shrink-0 mt-0.5" />
              <span>
                All lots are subject to our standard 8% consignor commission upon successful hammer realization.
                Reserve prices remain strictly hidden from all bidders.
              </span>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="text-xs uppercase tracking-luxury text-luxury-champagne hover:text-luxury-ivory"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="py-3.5 bg-luxury-gold hover:bg-luxury-goldLight text-luxury-black font-semibold text-xs uppercase tracking-luxury px-10 transition-all shadow-[0_8px_20px_rgba(198,166,106,0.3)]"
              >
                Submit Consignment for Review
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
