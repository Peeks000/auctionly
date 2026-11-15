import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, Scale, FileText, ArrowLeft, Landmark } from "lucide-react";

interface PolicyContent {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: { title: string; content: string[] }[];
}

const policiesData: Record<string, PolicyContent> = {
  terms: {
    title: "Terms of Service & Bidding Conditions",
    subtitle: "Governance governing all digital auctions, instant purchases, and platform interactions.",
    lastUpdated: "January 15, 2026",
    sections: [
      {
        title: "1. Scope and Acceptance",
        content: [
          "These Terms of Service govern all access to and participation in online auctions, timed sales, private transactions, and consignments conducted by AUCTIONLY Technologies Pvt. Ltd. ('AUCTIONLY').",
          "By creating an account, registering for an auction, placing a bid, or executing an instant purchase, you agree to be bound unconditionally by these Terms and all incorporated schedules.",
        ],
      },
      {
        title: "2. Bidder Registration and Identity Verification",
        content: [
          "Participation in AUCTIONLY auctions requires verified collector registration. AUCTIONLY reserves the right to conduct Know-Your-Customer (KYC) identity checks, request permanent account number (PAN) verification, and demand pre-auction financial security deposits.",
          "Bidders must be at least 18 years of age and legally competent to enter binding contracts under the Indian Contract Act, 1872.",
        ],
      },
      {
        title: "3. Nature of Bids & The Hammer Price",
        content: [
          "Every bid submitted on AUCTIONLY constitutes an irrevocable offer to acquire the subject lot at that price.",
          "A bid cannot be retracted once submitted. When the virtual gavel falls (or the timed countdown reaches zero without higher competing bids), the highest accepted bid becomes the legally binding Hammer Price.",
        ],
      },
      {
        title: "4. Dynamic Soft-Close Anti-Sniping Protocol",
        content: [
          "To safeguard the fairness of all participants, AUCTIONLY employs a dynamic anti-sniping extension window. Any competitive bid submitted within the final two (2) minutes of an active auction automatically extends the countdown clock by an additional three (3) minutes.",
        ],
      },
    ],
  },
  "buyer-agreement": {
    title: "Buyer’s Agreement & Premium Schedule",
    subtitle: "Statutory fees, taxes, settlement terms, and buyer rights.",
    lastUpdated: "January 15, 2026",
    sections: [
      {
        title: "1. The Buyer's Premium",
        content: [
          "In addition to the hammer price, the successful buyer agrees to pay AUCTIONLY a Buyer's Premium of twelve percent (12.0%) on the hammer price for fine art, decorative items, and antiquities, or ten percent (10.0%) for numismatics and philately.",
        ],
      },
      {
        title: "2. Goods and Services Tax (GST)",
        content: [
          "As required under Indian tax statutes, Goods and Services Tax (GST) of eighteen percent (18.0%) is levied strictly upon the Buyer's Premium (the service fee charged by AUCTIONLY).",
          "GST on the hammer price of the artwork itself is governed by reverse-charge or consignor GST status and is clearly detailed on the authoritative proforma invoice generated at checkout.",
        ],
      },
      {
        title: "3. Payment & Settlement Timelines",
        content: [
          "Settlement in full must be executed within forty-eight (48) hours of auction closure via authorized Razorpay banking channels, RTGS, NEFT, or pre-approved institutional wire transfer.",
          "Title to the lot transfers to the purchaser only upon complete realization of cleared funds in AUCTIONLY's designated escrow account.",
        ],
      },
    ],
  },
  "seller-agreement": {
    title: "Seller Consignment Agreement",
    subtitle: "Terms and fee schedules governing the consignment and auction of artworks and collectibles.",
    lastUpdated: "January 15, 2026",
    sections: [
      {
        title: "1. Consignment Representation & Title",
        content: [
          "The Consignor warrants and covenants that they are the sole, legal, and beneficial owner of the consigned lot, with clear, unencumbered title free from liens, statutory claims, or family disputes.",
        ],
      },
      {
        title: "2. Consignor Commission Structure",
        content: [
          "AUCTIONLY deducts a tiered seller's commission from the hammer price upon successful settlement: 8% on lots up to ₹50,00,000; 6% on lots between ₹50,00,000 and ₹2,00,00,000; and bespoke institutional rates for single-owner collections.",
        ],
      },
      {
        title: "3. Reserve Prices",
        content: [
          "The Reserve Price is the confidential minimum price at which the lot may be sold. The reserve cannot exceed the low pre-sale estimate published in the catalogue.",
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy & Data Protection Policy",
    subtitle: "Compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act).",
    lastUpdated: "January 15, 2026",
    sections: [
      {
        title: "1. Information We Collect",
        content: [
          "We collect only data necessary for verified auction participation: full legal name, permanent account number (PAN) for high-value tax reporting, delivery addresses, and encrypted payment identifiers.",
          "We never store unencrypted credit card numbers, CVV codes, or net banking passwords.",
        ],
      },
      {
        title: "2. Purpose of Processing",
        content: [
          "Your data is processed strictly for identity verification, anti-money laundering (AML) compliance, issuance of GST-compliant tax invoices, and coordinated white-glove delivery.",
        ],
      },
      {
        title: "3. Anonymity in the Auction Room",
        content: [
          "In all public live bidding feeds and catalogues, collector identities are shielded behind randomized paddle identifiers (e.g. 'Paddle #429') to maintain complete market discretion.",
        ],
      },
    ],
  },
  authenticity: {
    title: "Authenticity Warranty & Provenance Guarantee",
    subtitle: "AUCTIONLY's legally binding guarantee of curatorial authenticity.",
    lastUpdated: "January 15, 2026",
    sections: [
      {
        title: "1. The 100% Provenance Warranty",
        content: [
          "AUCTIONLY warrants the authenticity of the authorship, maker, dynasty, and period of each lot as described in bold typography in the catalogue headline.",
          "If within twenty-four (24) months of the date of the auction, the original purchaser provides conclusive scientific or scholarly proof that the lot is a deliberate forgery or counterfeit, AUCTIONLY will rescind the sale and refund the full purchase price upon return of the lot.",
        ],
      },
      {
        title: "2. Exclusions from Warranty",
        content: [
          "This warranty does not apply if the catalogue description conformed to the generally accepted consensus of scholars and specialists at the date of the sale, or if the scientific processes capable of proving forgery were not in common use at that time.",
        ],
      },
    ],
  },
  restricted: {
    title: "Prohibited & Restricted Antiquities Policy",
    subtitle: "Statutory compliance with The Antiquities and Art Treasures Act, 1972.",
    lastUpdated: "January 15, 2026",
    sections: [
      {
        title: "1. Non-Exportable National Art Treasures",
        content: [
          "Under the provisions of The Antiquities and Art Treasures Act, 1972 (Act No. 52 of 1972), antiquities registered with the Archaeological Survey of India (ASI) cannot be exported out of the territory of the Republic of India.",
          "All such lots are explicitly catalogued with the restriction banner: 'NON-EXPORTABLE NATIONAL ART TREASURE. DOMESTIC RESALE ONLY.'",
        ],
      },
      {
        title: "2. Form VII Registration Transfer",
        content: [
          "Purchasers of registered antiquities must hold valid Indian tax residency. AUCTIONLY assists both consignor and purchaser with the statutory Form VII transfer notice to the relevant Superintending Archaeologist of the ASI.",
        ],
      },
      {
        title: "3. Prohibited Objects",
        content: [
          "AUCTIONLY strictly prohibits the consignment or sale of illicitly excavated cultural property, ivory objects prohibited under the Wildlife Protection Act, 1972, or objects lacking clear historical chain-of-custody.",
        ],
      },
    ],
  },
};

export function generateStaticParams() {
  return [
    { slug: "terms" },
    { slug: "buyer-agreement" },
    { slug: "seller-agreement" },
    { slug: "privacy" },
    { slug: "authenticity" },
    { slug: "restricted" },
  ];
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = policiesData[slug];

  if (!policy) {
    notFound();
  }

  const allSlugs = [
    { slug: "terms", label: "Terms of Service" },
    { slug: "buyer-agreement", label: "Buyer Agreement & Premium" },
    { slug: "seller-agreement", label: "Seller Consignment" },
    { slug: "privacy", label: "Privacy & DPDP Policy" },
    { slug: "authenticity", label: "Authenticity Warranty" },
    { slug: "restricted", label: "Restricted Antiquities" },
  ];

  return (
    <div className="min-h-screen bg-luxury-black text-luxury-ivory flex flex-col justify-between selection:bg-luxury-gold selection:text-black">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-luxury-champagne/15">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs uppercase tracking-luxury text-luxury-champagne hover:text-luxury-gold transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to AUCTIONLY Homepage</span>
          </Link>
          <div className="flex items-center gap-2 text-[11px] text-luxury-muted">
            <Scale size={14} className="text-luxury-gold" />
            <span>Governance & Legal Covenants</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="bg-luxury-dark border border-luxury-champagne/15 p-4 rounded-sm sticky top-28">
              <span className="text-[10px] uppercase tracking-luxury text-luxury-gold font-semibold block mb-3 px-2">
                Policy Directory
              </span>
              <nav className="flex flex-col gap-1 text-xs">
                {allSlugs.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/policies/${item.slug}`}
                    className={`px-3 py-2 rounded-sm transition-colors ${
                      item.slug === slug
                        ? "bg-luxury-gold/15 text-luxury-gold font-medium border-l-2 border-luxury-gold"
                        : "text-luxury-champagne/70 hover:text-luxury-ivory hover:bg-luxury-black/40"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Policy Content */}
          <article className="lg:col-span-3 bg-luxury-dark border border-luxury-champagne/20 rounded-sm p-8 sm:p-12">
            <div className="border-b border-luxury-subtle pb-6 mb-8">
              <span className="text-[10px] uppercase tracking-luxury text-luxury-gold font-semibold block mb-2">
                AUCTIONLY Legal Governance
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-luxury-ivory font-light leading-tight">
                {policy.title}
              </h1>
              <p className="text-xs sm:text-sm text-luxury-champagne/80 mt-2 font-light">
                {policy.subtitle}
              </p>
              <div className="mt-4 text-[11px] text-luxury-muted">
                Effective Date: {policy.lastUpdated} • Republic of India Jurisdiction
              </div>
            </div>

            <div className="space-y-8">
              {policy.sections.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  <h2 className="font-serif text-lg text-luxury-ivory font-medium">
                    {section.title}
                  </h2>
                  {section.content.map((p, pIdx) => (
                    <p
                      key={pIdx}
                      className="text-xs sm:text-sm text-luxury-champagne/80 leading-relaxed font-light"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-12 pt-6 border-t border-luxury-subtle/50 text-[11px] text-luxury-muted flex items-center justify-between">
              <span>AUCTIONLY Technologies Pvt. Ltd.</span>
              <span>All Rights Reserved</span>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
