"use client";

import React, { useState } from "react";
import { formatINR } from "@/lib/currency";
import { mockListings } from "@/lib/data/mockCatalogue";
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  Gavel,
  Users,
  FileCheck,
  AlertTriangle,
  Database,
  Lock,
  Activity,
  Layers,
} from "lucide-react";

export default function AdminCommandCenter() {
  const [activeTab, setActiveTab] = useState<"moderation" | "verifications" | "quotas" | "audit">("moderation");

  const [pendingListings, setPendingListings] = useState([
    {
      id: "pen-1",
      seller: "Rao Bahadur Antiques",
      category: "Antiques & Historical Objects",
      title: "Silver Bidri Ware Hookah Base, Hyderabad c. 1850",
      startingPrice: 35000000, // ₹3,50,000
      reservePrice: 45000000,
      format: "timed_auction",
    },
    {
      id: "pen-2",
      seller: "Heritage Horology Club",
      category: "Watches & Jewellery",
      title: "Rolex Submariner Ref. 5513 'Meters First' (1967)",
      startingPrice: 120000000, // ₹12,00,000
      reservePrice: 140000000,
      format: "live_auction",
    },
  ]);

  const handleApproveListing = (id: string) => {
    alert(`Listing ${id} approved and published to live catalogue.`);
    setPendingListings((prev) => prev.filter((item) => item.id !== id));
  };

  const handleRejectListing = (id: string) => {
    const reason = prompt("Enter deficiency notice reason for rejection:");
    if (reason) {
      alert(`Listing ${id} returned to seller with deficiency notes: "${reason}".`);
      setPendingListings((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">
      {/* Admin Header */}
      <div className="border-b border-luxury-champagne/15 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-luxury-gold text-xs uppercase tracking-luxury mb-1">
            <Lock size={14} />
            <span>High-Assurance Operations</span>
          </div>
          <h1 className="font-serif text-3xl text-luxury-ivory font-medium">
            Administrative Control Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-red-950/70 border border-red-800 text-red-300 text-xs uppercase tracking-wider font-semibold">
            Super Admin Session Active
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-luxury p-6 flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-luxury text-luxury-muted">Realized GMV (Gross Value)</span>
          <span className="font-mono text-2xl font-bold text-luxury-ivory mt-2">₹14.85 Cr</span>
          <span className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1">
            <Activity size={10} />
            <span>Authoritative INR ledger</span>
          </span>
        </div>

        <div className="card-luxury p-6 flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-luxury text-luxury-muted">Pending Moderation</span>
          <span className="font-mono text-2xl font-bold text-luxury-gold mt-2">{pendingListings.length} Lots</span>
          <span className="text-[10px] text-luxury-champagne/70 mt-2">Awaiting specialist review</span>
        </div>

        <div className="card-luxury p-6 flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-luxury text-luxury-muted">Verification Applications</span>
          <span className="font-mono text-2xl font-bold text-luxury-ivory mt-2">3 Pending</span>
          <span className="text-[10px] text-luxury-champagne/70 mt-2">PAN & ASI Licenses</span>
        </div>

        <div className="card-luxury p-6 flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-luxury text-luxury-muted">Active Live Gala Status</span>
          <span className="font-mono text-2xl font-bold text-emerald-400 mt-2">Operational</span>
          <span className="text-[10px] text-luxury-champagne/70 mt-2">WebRTC low-latency relay</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-luxury-champagne/15 gap-8 text-xs uppercase tracking-luxury text-luxury-champagne/70">
        <button
          onClick={() => setActiveTab("moderation")}
          className={`pb-3 font-medium transition-colors ${
            activeTab === "moderation" ? "text-luxury-gold border-b-2 border-luxury-gold" : "hover:text-luxury-ivory"
          }`}
        >
          Listing Moderation ({pendingListings.length})
        </button>
        <button
          onClick={() => setActiveTab("verifications")}
          className={`pb-3 font-medium transition-colors ${
            activeTab === "verifications" ? "text-luxury-gold border-b-2 border-luxury-gold" : "hover:text-luxury-ivory"
          }`}
        >
          Seller Verifications (3)
        </button>
        <button
          onClick={() => setActiveTab("quotas")}
          className={`pb-3 font-medium transition-colors ${
            activeTab === "quotas" ? "text-luxury-gold border-b-2 border-luxury-gold" : "hover:text-luxury-ivory"
          }`}
        >
          Free-Tier Resource Monitor
        </button>
      </div>

      {/* Moderation Desk */}
      {activeTab === "moderation" && (
        <div className="card-luxury p-6 flex flex-col gap-4">
          <h3 className="font-serif text-lg text-luxury-ivory font-medium">Consignment Queue Awaiting Approval</h3>

          {pendingListings.length > 0 ? (
            <div className="flex flex-col gap-4">
              {pendingListings.map((lot) => (
                <div
                  key={lot.id}
                  className="p-5 bg-luxury-black/70 border border-luxury-subtle/50 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-[10px] uppercase tracking-luxury text-luxury-gold">{lot.category}</span>
                    <h4 className="font-serif text-base text-luxury-ivory font-medium mt-0.5">{lot.title}</h4>
                    <p className="text-xs text-luxury-champagne/70 mt-1">Consignor: {lot.seller}</p>
                    <div className="flex items-center gap-4 text-xs font-mono text-luxury-muted mt-2">
                      <span>Starting: {formatINR(lot.startingPrice)}</span>
                      <span>Reserve (Hidden): {formatINR(lot.reservePrice)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleApproveListing(lot.id)}
                      className="px-4 py-2 bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700 text-emerald-200 text-xs uppercase tracking-wider font-medium transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle size={14} />
                      <span>Approve & Publish</span>
                    </button>
                    <button
                      onClick={() => handleRejectListing(lot.id)}
                      className="px-4 py-2 bg-red-950/70 hover:bg-red-900 border border-red-800 text-red-200 text-xs uppercase tracking-wider font-medium transition-colors flex items-center gap-1.5"
                    >
                      <XCircle size={14} />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-luxury-muted py-8 text-center">All consignment queues are clear.</p>
          )}
        </div>
      )}

      {/* Free-Tier Resource Quotas */}
      {activeTab === "quotas" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-luxury p-6 flex flex-col gap-3">
            <span className="text-xs uppercase tracking-luxury text-luxury-champagne font-medium flex items-center gap-2">
              <Database size={14} className="text-luxury-gold" />
              <span>Supabase DB Storage</span>
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="font-mono text-xl font-bold text-luxury-ivory">42 MB / 500 MB</span>
              <span className="text-xs text-emerald-400">8.4% used</span>
            </div>
            <div className="w-full bg-luxury-black h-2 rounded-full overflow-hidden border border-luxury-subtle/30">
              <div className="bg-emerald-500 h-full w-[8.4%]" />
            </div>
            <span className="text-[10px] text-luxury-muted">Status: Optimal. Zero cost.</span>
          </div>

          <div className="card-luxury p-6 flex flex-col gap-3">
            <span className="text-xs uppercase tracking-luxury text-luxury-champagne font-medium flex items-center gap-2">
              <Layers size={14} className="text-luxury-gold" />
              <span>Supabase File Storage</span>
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="font-mono text-xl font-bold text-luxury-ivory">210 MB / 1000 MB</span>
              <span className="text-xs text-emerald-400">21% used</span>
            </div>
            <div className="w-full bg-luxury-black h-2 rounded-full overflow-hidden border border-luxury-subtle/30">
              <div className="bg-emerald-500 h-full w-[21%]" />
            </div>
            <span className="text-[10px] text-luxury-muted">Status: Optimal. 3D GLB assets compressed.</span>
          </div>

          <div className="card-luxury p-6 flex flex-col gap-3">
            <span className="text-xs uppercase tracking-luxury text-luxury-champagne font-medium flex items-center gap-2">
              <Activity size={14} className="text-luxury-gold" />
              <span>Hosting Bandwidth</span>
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="font-mono text-xl font-bold text-luxury-ivory">14.2 GB / 100 GB</span>
              <span className="text-xs text-emerald-400">14.2% used</span>
            </div>
            <div className="w-full bg-luxury-black h-2 rounded-full overflow-hidden border border-luxury-subtle/30">
              <div className="bg-emerald-500 h-full w-[14.2%]" />
            </div>
            <span className="text-[10px] text-luxury-muted">Status: Netlify/Vercel Free Tier compliant.</span>
          </div>
        </div>
      )}
    </div>
  );
}
