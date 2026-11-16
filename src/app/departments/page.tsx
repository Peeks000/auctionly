import React from "react";
import Link from "next/link";
import { safeImagePath } from "@/lib/images";
import { mockCategories, mockListings } from "@/lib/data/mockCatalogue";
import { formatINR } from "@/lib/currency";
import { ArrowRight, ChevronRight, ShieldCheck, Layers } from "lucide-react";

export default function DepartmentsOverviewPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-12">
      <div className="border-b border-luxury-champagne/15 pb-8 flex flex-col gap-3">
        <span className="text-xs uppercase tracking-luxury text-luxury-gold font-medium">Curatorial Taxonomy</span>
        <h1 className="font-serif text-3xl sm:text-4xl text-luxury-ivory font-medium">
          The 7 Specialist Departments
        </h1>
        <p className="text-xs sm:text-sm text-luxury-champagne/80 font-sans max-w-2xl leading-relaxed">
          AUCTIONLY is organized into seven curatorial houses, each staffed by accredited specialists responsible for physical inspection, provenance certification, and market valuation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockCategories.map((dept) => {
          const deptLots = mockListings.filter((l) => l.category_id === dept.id);
          const sampleLot = deptLots[0];

          return (
            <div key={dept.id} className="card-luxury card-luxury-hover p-6 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-luxury-gold mb-3">
                  <span>DEPARTMENT 0{dept.display_order}</span>
                  <span className="text-luxury-muted">{deptLots.length} Registered Lots</span>
                </div>

                <Link href={`/departments/${dept.slug}`}>
                  <h2 className="font-serif text-xl text-luxury-ivory group-hover:text-luxury-gold transition-colors font-medium">
                    {dept.name}
                  </h2>
                </Link>

                <p className="text-xs text-luxury-champagne/70 mt-2 leading-relaxed">
                  {dept.description}
                </p>

                {sampleLot && (
                  <div className="mt-5 pt-4 border-t border-luxury-subtle/30 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-sm overflow-hidden bg-luxury-black shrink-0 relative">
                      <img src={safeImagePath(sampleLot.primary_image_url)} alt={sampleLot.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="truncate">
                      <span className="text-[10px] uppercase tracking-wider text-luxury-muted block">Marquee Lot</span>
                      <span className="text-xs text-luxury-ivory truncate block font-serif">{sampleLot.title}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-luxury-subtle/30 flex items-center justify-between text-xs">
                <span className="text-[11px] text-luxury-muted">
                  Buyer&apos;s Premium: {dept.buyer_premium_pct}%
                </span>
                <Link
                  href={`/departments/${dept.slug}`}
                  className="text-luxury-gold hover:text-luxury-ivory font-medium uppercase tracking-wider text-[11px] flex items-center gap-1 transition-colors"
                >
                  <span>Explore Department</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
