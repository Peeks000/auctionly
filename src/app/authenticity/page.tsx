import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  ShieldCheck,
  FileCheck2,
  Microscope,
  Landmark,
  Scale,
  Award,
  ArrowRight,
  CheckCircle2,
  Scroll,
  Lock,
} from "lucide-react";

export const metadata = {
  title: "Provenance & Authenticity Guarantee | AUCTIONLY",
  description:
    "AUCTIONLY's four-pillar provenance verification protocol and authoritative authenticity warranty for high-value fine art, antiquities, and collectibles.",
};

export default function AuthenticityPage() {
  return (
    <div className="min-h-screen bg-luxury-black text-luxury-ivory flex flex-col justify-between selection:bg-luxury-gold selection:text-black">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex-1 w-full">
        {/* Hero Section */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1 rounded-sm bg-luxury-dark border border-luxury-gold/50 text-luxury-gold">
              <ShieldCheck size={16} />
            </span>
            <span className="text-[10px] uppercase tracking-luxury text-luxury-gold font-semibold">
              The Gold Standard of Due Diligence
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-luxury-ivory font-light leading-tight">
            Uncompromising Provenance. <br />
            Guaranteed Authenticity.
          </h1>
          <p className="text-sm sm:text-base text-luxury-champagne/80 mt-4 leading-relaxed font-light">
            Every masterpiece consigned to AUCTIONLY undergoes rigorous multi-stage scholarly inspection, physical forensic analysis, and historical chain-of-custody verification before appearing in our catalogues.
          </p>
        </div>

        {/* 4-Pillar Verification Grid */}
        <div className="mb-20">
          <div className="border-b border-luxury-champagne/15 pb-4 mb-8">
            <h2 className="font-serif text-2xl text-luxury-ivory font-light">
              The Four Pillars of AUCTIONLY Provenance
            </h2>
            <p className="text-xs text-luxury-champagne/70 mt-1">
              Our forensic and curatorial protocol surpasses conventional secondary-market standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="bg-luxury-dark border border-luxury-champagne/15 p-6 rounded-sm flex flex-col justify-between hover:border-luxury-gold/50 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-sm bg-luxury-black border border-luxury-gold/40 flex items-center justify-center text-luxury-gold mb-4">
                  <Microscope size={20} />
                </div>
                <span className="text-[10px] uppercase tracking-luxury text-luxury-gold font-semibold block mb-1">
                  Pillar 01
                </span>
                <h3 className="font-serif text-lg text-luxury-ivory font-medium mb-2">
                  Forensic Material Analysis
                </h3>
                <p className="text-xs text-luxury-champagne/70 leading-relaxed">
                  Non-destructive X-Ray Fluorescence (XRF) spectrometry, UV luminescence analysis, pigment identification, and dendrochronological testing to verify period accuracy.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-luxury-subtle/50 text-[10px] uppercase tracking-wider text-luxury-gold">
                Material Authenticity Confirmed
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-luxury-dark border border-luxury-champagne/15 p-6 rounded-sm flex flex-col justify-between hover:border-luxury-gold/50 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-sm bg-luxury-black border border-luxury-gold/40 flex items-center justify-center text-luxury-gold mb-4">
                  <Scroll size={20} />
                </div>
                <span className="text-[10px] uppercase tracking-luxury text-luxury-gold font-semibold block mb-1">
                  Pillar 02
                </span>
                <h3 className="font-serif text-lg text-luxury-ivory font-medium mb-2">
                  Documentary Chain-of-Custody
                </h3>
                <p className="text-xs text-luxury-champagne/70 leading-relaxed">
                  Exhaustive archival tracing through historical catalogues raisonnés, gallery acquisitions, original royal sanads, estate probate records, and historic exhibition stickers.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-luxury-subtle/50 text-[10px] uppercase tracking-wider text-luxury-gold">
                Documented Provenance
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-luxury-dark border border-luxury-champagne/15 p-6 rounded-sm flex flex-col justify-between hover:border-luxury-gold/50 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-sm bg-luxury-black border border-luxury-gold/40 flex items-center justify-center text-luxury-gold mb-4">
                  <Award size={20} />
                </div>
                <span className="text-[10px] uppercase tracking-luxury text-luxury-gold font-semibold block mb-1">
                  Pillar 03
                </span>
                <h3 className="font-serif text-lg text-luxury-ivory font-medium mb-2">
                  Independent Specialist Review
                </h3>
                <p className="text-xs text-luxury-champagne/70 leading-relaxed">
                  Vetting by accredited department heads and external independent scholars who possess authoritative expertise in specific dynasties, schools, horological movements, and artists.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-luxury-subtle/50 text-[10px] uppercase tracking-wider text-luxury-gold">
                Scholarly Consensus
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="bg-luxury-dark border border-luxury-champagne/15 p-6 rounded-sm flex flex-col justify-between hover:border-luxury-gold/50 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-sm bg-luxury-black border border-luxury-gold/40 flex items-center justify-center text-luxury-gold mb-4">
                  <Landmark size={20} />
                </div>
                <span className="text-[10px] uppercase tracking-luxury text-luxury-gold font-semibold block mb-1">
                  Pillar 04
                </span>
                <h3 className="font-serif text-lg text-luxury-ivory font-medium mb-2">
                  Statutory & ASI Compliance
                </h3>
                <p className="text-xs text-luxury-champagne/70 leading-relaxed">
                  Strict adherence to The Antiquities and Art Treasures Act, 1972. Form VII registration tracking, non-exportable status disclosures, and title clear of institutional claims.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-luxury-subtle/50 text-[10px] uppercase tracking-wider text-luxury-gold">
                Full Statutory Protection
              </div>
            </div>
          </div>
        </div>

        {/* Certificate of Authenticity Dossier Section */}
        <div className="bg-gradient-to-r from-luxury-dark via-luxury-black to-luxury-dark border border-luxury-gold/30 rounded-sm p-8 sm:p-12 mb-20 relative overflow-hidden">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-luxury text-luxury-gold font-semibold block mb-2">
              Physical & Cryptographic Assurance
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-luxury-ivory font-light mb-4">
              The AUCTIONLY Dossier & Tamper-Evident Seal
            </h2>
            <p className="text-xs sm:text-sm text-luxury-champagne/80 leading-relaxed mb-6 font-light">
              Every settled lot arrives with a hardbound, foil-stamped Curatorial Dossier containing high-resolution macro photography, historical attribution, physical condition report, and an embossed tamper-evident security seal.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-luxury-champagne/90 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-luxury-gold shrink-0" />
                <span>Physical Embossed Department Seal</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-luxury-gold shrink-0" />
                <span>Micro-print Watermark Paper</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-luxury-gold shrink-0" />
                <span>Condition Report Signed by Specialist</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-luxury-gold shrink-0" />
                <span>Statutory Registration Annexure (if applicable)</span>
              </li>
            </ul>

            <Link
              href="/policies/authenticity"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-luxury-gold hover:text-luxury-ivory transition-colors font-medium underline"
            >
              <span>Read Full Authenticity Warranty & Return Terms</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Legal Advisory Strip */}
        <div className="border border-luxury-champagne/15 bg-luxury-dark/40 p-6 rounded-sm text-center max-w-3xl mx-auto">
          <h4 className="font-serif text-base text-luxury-ivory font-normal mb-1">
            Questions on Attribution or Inquiries for Specialists?
          </h4>
          <p className="text-xs text-luxury-champagne/70 mb-4">
            Our Department Curators are available to discuss condition reports or arrange private inspections.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/private-sales"
              className="py-2.5 px-5 bg-luxury-gold hover:bg-luxury-gold-hover text-luxury-black text-xs uppercase tracking-luxury font-semibold transition-all"
            >
              Contact Curatorial Advisory
            </Link>
            <Link
              href="/catalogue"
              className="py-2.5 px-5 bg-luxury-black hover:bg-luxury-dark border border-luxury-subtle text-luxury-ivory text-xs uppercase tracking-luxury font-medium transition-all"
            >
              View Curated Lots
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
