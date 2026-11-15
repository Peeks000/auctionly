"use client";

import React from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import LotCard from "@/components/catalogue/LotCard";
import { mockCategories, mockListings } from "@/lib/data/mockCatalogue";
import { ChevronRight, ShieldCheck, Award, ArrowLeft } from "lucide-react";

export default function DepartmentDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const department = mockCategories.find((c) => c.slug === slug);

  if (!department) {
    notFound();
  }

  const departmentLots = mockListings.filter((l) => l.category_id === department.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-luxury-champagne/60 uppercase tracking-luxury">
        <Link href="/" className="hover:text-luxury-gold transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/departments" className="hover:text-luxury-gold transition-colors">Departments</Link>
        <ChevronRight size={12} />
        <span className="text-luxury-gold">{department.name}</span>
      </nav>

      {/* Department Header */}
      <div className="card-luxury p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2 max-w-2xl">
          <span className="text-xs uppercase tracking-luxury text-luxury-gold font-medium">Department 0{department.display_order}</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-luxury-ivory font-medium">
            {department.name}
          </h1>
          <p className="text-xs sm:text-sm text-luxury-champagne/80 mt-1 leading-relaxed">
            {department.description}
          </p>
        </div>

        <div className="flex flex-col gap-2 text-right bg-luxury-black/60 p-4 border border-luxury-subtle/50 rounded-sm min-w-[200px]">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-luxury-muted block">Buyer&apos;s Premium</span>
            <span className="font-mono text-base font-semibold text-luxury-ivory">{department.buyer_premium_pct}%</span>
          </div>
          <div className="pt-2 border-t border-luxury-subtle/40">
            <span className="text-[10px] uppercase tracking-wider text-luxury-muted block">Consignor Fee</span>
            <span className="font-mono text-base font-semibold text-luxury-gold">{department.seller_commission_pct}%</span>
          </div>
        </div>
      </div>

      {/* Lots Grid */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-luxury-champagne/15 pb-4">
          <h2 className="font-serif text-xl text-luxury-ivory font-medium">
            Active & Upcoming Lots ({departmentLots.length})
          </h2>
          <Link
            href="/studio"
            className="text-xs uppercase tracking-luxury text-luxury-gold hover:text-luxury-ivory transition-colors"
          >
            Consign to this Department →
          </Link>
        </div>

        {departmentLots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departmentLots.map((lot) => (
              <LotCard key={lot.id} listing={lot} />
            ))}
          </div>
        ) : (
          <div className="p-16 text-center bg-luxury-dark/30 border border-luxury-subtle/30 rounded-sm">
            <p className="font-serif text-lg text-luxury-ivory">No lots currently open in this department.</p>
            <Link
              href="/catalogue"
              className="mt-3 inline-block text-xs uppercase tracking-luxury text-luxury-gold hover:underline"
            >
              Browse Complete Catalogue
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
