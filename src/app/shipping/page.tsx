import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Truck,
  ShieldCheck,
  Package,
  ThermometerSnowflake,
  ShieldAlert,
  Landmark,
  FileText,
  Clock,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "White-Glove Shipping & Art Transit | AUCTIONLY",
  description:
    "AUCTIONLY's armored, climate-controlled art transit and white-glove delivery protocols across India and worldwide.",
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-luxury-black text-luxury-ivory flex flex-col justify-between selection:bg-luxury-gold selection:text-black">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex-1 w-full">
        {/* Hero Section */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1 rounded-sm bg-luxury-dark border border-luxury-gold/50 text-luxury-gold">
              <Truck size={16} />
            </span>
            <span className="text-[10px] uppercase tracking-luxury text-luxury-gold font-semibold">
              Specialized Logistics & Conservation
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-luxury-ivory font-light leading-tight">
            White-Glove Art Transport & Armored Security
          </h1>
          <p className="text-sm sm:text-base text-luxury-champagne/80 mt-4 leading-relaxed font-light">
            From gallery wall to private vault, every masterpiece acquired on AUCTIONLY is packaged, insured, and transported according to international museum conservation standards.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-luxury-dark border border-luxury-champagne/15 p-8 rounded-sm hover:border-luxury-gold/40 transition-colors">
            <div className="w-12 h-12 rounded-sm bg-luxury-black border border-luxury-gold/40 flex items-center justify-center text-luxury-gold mb-6">
              <Package size={22} />
            </div>
            <h3 className="font-serif text-xl text-luxury-ivory font-medium mb-3">
              Archival Museum Crating
            </h3>
            <p className="text-xs text-luxury-champagne/70 leading-relaxed">
              Custom-built heat-treated plywood crates lined with archival Tyvek, Plastazote foam cushioning, and shock indicators calibrated to the exact weight and dimensions of the object.
            </p>
          </div>

          <div className="bg-luxury-dark border border-luxury-champagne/15 p-8 rounded-sm hover:border-luxury-gold/40 transition-colors">
            <div className="w-12 h-12 rounded-sm bg-luxury-black border border-luxury-gold/40 flex items-center justify-center text-luxury-gold mb-6">
              <ThermometerSnowflake size={22} />
            </div>
            <h3 className="font-serif text-xl text-luxury-ivory font-medium mb-3">
              Climate-Controlled Transit
            </h3>
            <p className="text-xs text-luxury-champagne/70 leading-relaxed">
              Air-ride, temperature-regulated (21°C ± 2°C) and relative humidity monitored (50% ± 5%) transport vehicles equipped with dual telemetry data loggers.
            </p>
          </div>

          <div className="bg-luxury-dark border border-luxury-champagne/15 p-8 rounded-sm hover:border-luxury-gold/40 transition-colors">
            <div className="w-12 h-12 rounded-sm bg-luxury-black border border-luxury-gold/40 flex items-center justify-center text-luxury-gold mb-6">
              <ShieldAlert size={22} />
            </div>
            <h3 className="font-serif text-xl text-luxury-ivory font-medium mb-3">
              Armored Escort & Transit Insurance
            </h3>
            <p className="text-xs text-luxury-champagne/70 leading-relaxed">
              Armed security escort for high-value jewellery and numismatic consignments within India, coupled with 100% full-value all-risk transit insurance.
            </p>
          </div>
        </div>

        {/* Domestic & International Timelines */}
        <div className="bg-luxury-dark border border-luxury-champagne/20 rounded-sm p-8 sm:p-10 mb-16">
          <h2 className="font-serif text-2xl text-luxury-ivory font-light mb-6 border-b border-luxury-subtle/50 pb-3">
            Transit Protocols & Timelines
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-luxury-champagne/80">
            <div>
              <h4 className="text-sm uppercase tracking-luxury text-luxury-gold font-semibold mb-3">
                Domestic (Pan-India Transit)
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-luxury-gold font-mono">•</span>
                  <span><strong>Metro Cities (Mumbai, Delhi NCR, Bengaluru):</strong> Hand-delivery by registrar within 3 to 5 business days post-settlement.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-luxury-gold font-mono">•</span>
                  <span><strong>Tier-2 & Regional Locations:</strong> Specialized air-cargo or dedicated transit within 5 to 8 business days.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-luxury-gold font-mono">•</span>
                  <span><strong>Antiquities Compliance:</strong> Includes ASI Form VII transfer paperwork verification before movement.</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm uppercase tracking-luxury text-luxury-gold font-semibold mb-3">
                International (Export-Permissible Lots)
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-luxury-gold font-mono">•</span>
                  <span><strong>Non-Restricted Contemporary Works:</strong> Customs clearance and DHL/FedEx Express art courier within 7 to 12 business days.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-luxury-gold font-mono">•</span>
                  <span><strong>Duties & Import Tariffs:</strong> Recipient remains responsible for local customs duties and VAT as applicable by destination jurisdiction.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-luxury-gold font-mono">•</span>
                  <span><strong>Restricted Antiquities:</strong> Clear notice that items marked "Non-Exportable National Art Treasure" cannot leave India under the Antiquities Act of 1972.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-6">
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 py-3 px-8 bg-luxury-gold hover:bg-luxury-gold-hover text-luxury-black text-xs uppercase tracking-luxury font-semibold transition-all shadow-md"
          >
            <span>Explore Curated Lots</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
