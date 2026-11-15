"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { mockCategories } from "@/lib/data/mockCatalogue";
import { formatINR } from "@/lib/currency";
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
  X,
  ArrowRight,
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
    sellerName: "",
    sellerEmail: "",
    sellerPhone: "",
  });

  const [uploadedImages, setUploadedImages] = useState<{ name: string; url: string; sizeMb: string }[]>([]);
  const [aiEnhancing, setAiEnhancing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionData, setSubmissionData] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Form Change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Image File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: { name: string; url: string; sizeMb: string }[] = [];

    Array.from(files).forEach((file) => {
      // Validate file size (< 25MB)
      if (file.size > 25 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 25MB limit.`);
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2) + " MB";
      newImages.push({ name: file.name, url: previewUrl, sizeMb });
    });

    setUploadedImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Grounded AI Description Assistant
  const handleAiEnhance = () => {
    if (!formData.title && !formData.artist) {
      alert("Please enter a title or artist name first.");
      return;
    }
    setAiEnhancing(true);
    setTimeout(() => {
      const generated = `Imperial craftsmanship originating from ${
        formData.period || "19th century"
      }. Characterized by master-level execution in ${
        formData.materials || "traditional materials"
      }, preserved in ${formData.conditionGrade} state with complete curatorial provenance inspection.`;
      setFormData((prev) => ({ ...prev, conditionReport: generated }));
      setAiEnhancing(false);
    }, 800);
  };

  // Authoritative Server Consignment Intake
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const startingNum = parseFloat(formData.startingPrice);
      const reserveNum = formData.reservePrice ? parseFloat(formData.reservePrice) : null;
      const buyNowNum = formData.buyNowPrice ? parseFloat(formData.buyNowPrice) : null;

      if (isNaN(startingNum) || startingNum <= 0) {
        throw new Error("Please specify a valid starting price in INR.");
      }

      if (reserveNum && reserveNum < startingNum) {
        throw new Error("Reserve price cannot be lower than the opening starting bid.");
      }

      const res = await fetch("/api/consignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          artist: formData.artist,
          period: formData.period,
          materials: formData.materials,
          dimensions: formData.dimensions,
          conditionGrade: formData.conditionGrade,
          conditionReport: formData.conditionReport,
          provenance: formData.provenance,
          startingPrice: startingNum,
          reservePrice: reserveNum,
          buyNowPrice: buyNowNum,
          saleFormat: formData.saleFormat,
          sellerName: formData.sellerName || "Consignor Partner",
          sellerEmail: formData.sellerEmail || "consignor@auctionly.in",
          sellerPhone: formData.sellerPhone || null,
          imageCount: uploadedImages.length,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit consignment to server.");
      }

      setSubmissionData(data.consignment);
    } catch (err: any) {
      setSubmissionError(err.message || "Failed to register consignment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center flex flex-col items-center gap-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-luxury-gold/20 border border-luxury-gold flex items-center justify-center text-luxury-gold">
          <CheckCircle2 size={36} />
        </div>
        <span className="text-[10px] uppercase tracking-luxury text-luxury-gold font-semibold">
          Authoritative Intake Confirmed
        </span>
        <h1 className="font-serif text-3xl text-luxury-ivory font-medium">
          Dossier Registered: {submissionData.consignmentNumber}
        </h1>
        <p className="text-xs sm:text-sm text-luxury-champagne/80 max-w-md leading-relaxed">
          Your consignment has been securely logged in our curatorial intake database in status{" "}
          <strong className="text-luxury-gold">Pending Specialist Review</strong>. Our department specialists will review material authenticity and contact you at{" "}
          <strong className="text-luxury-ivory">{submissionData.seller.email}</strong> within {submissionData.estimatedReviewWindowHours} hours.
        </p>

        <div className="w-full bg-luxury-dark border border-luxury-champagne/20 p-5 rounded-sm text-left text-xs space-y-2">
          <div className="flex justify-between border-b border-luxury-subtle pb-2">
            <span className="text-luxury-muted">Consignment Reference:</span>
            <span className="font-mono text-luxury-gold font-medium">{submissionData.consignmentNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-luxury-muted">Catalogued Lot:</span>
            <span className="text-luxury-ivory font-medium">{submissionData.item.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-luxury-muted">Opening Bid Floor:</span>
            <span className="font-mono text-luxury-ivory">{formatINR(submissionData.item.startingPricePaisa)}</span>
          </div>
          {submissionData.item.reservePricePaisa && (
            <div className="flex justify-between">
              <span className="text-luxury-muted">Protected Reserve:</span>
              <span className="font-mono text-luxury-gold">{formatINR(submissionData.item.reservePricePaisa)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-luxury-muted">Photographs Attached:</span>
            <span className="text-luxury-ivory">{submissionData.imageCount} high-res assets</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => {
              setSubmissionData(null);
              setCurrentStep(1);
              setUploadedImages([]);
            }}
            className="px-6 py-3 bg-luxury-gold hover:bg-luxury-gold-hover text-luxury-black font-semibold text-xs uppercase tracking-luxury transition-all"
          >
            Submit Another Lot
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-luxury-black border border-luxury-champagne/30 hover:border-luxury-gold text-luxury-ivory text-xs uppercase tracking-luxury font-medium transition-all"
          >
            Go to Dashboard
          </Link>
        </div>
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
          2. Provenance & Media
        </span>
        <span className="text-luxury-subtle">•</span>
        <span className={currentStep === 3 ? "text-luxury-gold font-semibold" : "text-luxury-muted"}>
          3. Valuation & Consignor Contact
        </span>
      </div>

      {submissionError && (
        <div className="p-4 bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2 rounded-sm">
          <AlertCircle size={16} className="shrink-0" />
          <span>{submissionError}</span>
        </div>
      )}

      {/* Step Form */}
      <form onSubmit={handleSubmit} className="card-luxury p-8 flex flex-col gap-6">
        {currentStep === 1 && (
          <div className="flex flex-col gap-6">
            <h3 className="font-serif text-xl text-luxury-ivory font-medium">Department & Object Details</h3>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-luxury text-luxury-champagne">Department *</label>
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
              <label className="text-xs uppercase tracking-luxury text-luxury-champagne">Lot Title *</label>
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
              onClick={() => {
                if (!formData.title.trim()) {
                  alert("Please enter a lot title.");
                  return;
                }
                setCurrentStep(2);
              }}
              className="mt-4 py-3 bg-luxury-gold text-luxury-black font-semibold text-xs uppercase tracking-luxury self-end px-8 hover:bg-luxury-gold-hover transition-all"
            >
              Continue to Provenance & Media →
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

            {/* Interactive Image Upload Area */}
            <div className="flex flex-col gap-3">
              <label className="text-xs uppercase tracking-luxury text-luxury-champagne">
                Photographic & 3D Assets ({uploadedImages.length} uploaded)
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-luxury-champagne/30 hover:border-luxury-gold p-8 rounded-sm text-center flex flex-col items-center gap-2 bg-luxury-black/40 cursor-pointer transition-colors"
              >
                <UploadCloud size={32} className="text-luxury-gold" />
                <p className="text-xs text-luxury-ivory font-medium">
                  Click to select high-resolution images or drag and drop
                </p>
                <p className="text-[10px] text-luxury-muted">Supports JPG, PNG, and WEBP formats (max 25MB each)</p>
              </div>

              {/* Uploaded Thumbnails Preview */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="relative group border border-luxury-champagne/30 rounded-sm overflow-hidden bg-luxury-dark h-24">
                      <Image
                        src={img.url}
                        alt={img.name}
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(idx);
                        }}
                        className="absolute top-1 right-1 bg-black/80 text-white p-1 rounded-sm opacity-90 hover:opacity-100"
                        title="Remove photo"
                      >
                        <X size={12} />
                      </button>
                      <div className="absolute bottom-0 inset-x-0 bg-black/75 px-1 py-0.5 text-[9px] text-luxury-champagne truncate">
                        {img.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                className="py-3 bg-luxury-gold text-luxury-black font-semibold text-xs uppercase tracking-luxury px-8 hover:bg-luxury-gold-hover transition-all"
              >
                Continue to Pricing & Contact →
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="flex flex-col gap-6">
            <h3 className="font-serif text-xl text-luxury-ivory font-medium">Sale Format, Reserve & Consignor Contact</h3>

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
                <label className="text-xs uppercase tracking-luxury text-luxury-champagne">Starting Bid (INR ₹) *</label>
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
                <label className="text-xs uppercase tracking-luxury text-luxury-champagne">Protected Reserve Price (INR ₹)</label>
                <input
                  type="number"
                  name="reservePrice"
                  placeholder="e.g. 750000 (Cannot be below starting bid)"
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

            {/* Consignor Contact Information */}
            <div className="border-t border-luxury-subtle/50 pt-4 flex flex-col gap-4">
              <h4 className="font-serif text-sm text-luxury-ivory font-medium">Consignor Representation</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-luxury text-luxury-champagne block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    name="sellerName"
                    placeholder="e.g. Maharaja Sawai Foundation"
                    value={formData.sellerName}
                    onChange={handleChange}
                    className="w-full bg-luxury-black border border-luxury-champagne/30 p-2.5 text-xs text-luxury-ivory focus:border-luxury-gold outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-luxury text-luxury-champagne block mb-1">Contact Email *</label>
                  <input
                    type="email"
                    name="sellerEmail"
                    required
                    placeholder="consignor@estate.in"
                    value={formData.sellerEmail}
                    onChange={handleChange}
                    className="w-full bg-luxury-black border border-luxury-champagne/30 p-2.5 text-xs text-luxury-ivory focus:border-luxury-gold outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-luxury text-luxury-champagne block mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    name="sellerPhone"
                    placeholder="+91 98200 00000"
                    value={formData.sellerPhone}
                    onChange={handleChange}
                    className="w-full bg-luxury-black border border-luxury-champagne/30 p-2.5 text-xs text-luxury-ivory focus:border-luxury-gold outline-none"
                  />
                </div>
              </div>
            </div>

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
                disabled={isSubmitting}
                className="py-3.5 bg-luxury-gold hover:bg-luxury-gold-hover disabled:opacity-50 text-luxury-black font-semibold text-xs uppercase tracking-luxury px-10 transition-all shadow-[0_8px_20px_rgba(198,166,106,0.3)] flex items-center gap-2"
              >
                <span>{isSubmitting ? "Registering Consignment..." : "Submit Consignment for Review"}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
