import React from "react";
import Link from "next/link";
import LogoWordmark from "../brand/LogoWordmark";
import { ShieldCheck, Award, Lock, Landmark, Mail } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-luxury-black border-t border-luxury-champagne/20 text-luxury-muted mt-24">
      {/* Trust & Guarantee Strip */}
      <div className="border-b border-luxury-subtle/40 bg-luxury-dark/40 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <ShieldCheck className="text-luxury-gold shrink-0" size={24} />
            <div>
              <h4 className="text-xs uppercase tracking-luxury text-luxury-ivory font-medium">Curatorial Authenticity</h4>
              <p className="text-[11px] text-luxury-champagne/70 mt-0.5">Every lot vetted by certified department specialists</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <Lock className="text-luxury-gold shrink-0" size={24} />
            <div>
              <h4 className="text-xs uppercase tracking-luxury text-luxury-ivory font-medium">Authoritative Escrow</h4>
              <p className="text-[11px] text-luxury-champagne/70 mt-0.5">Razorpay Test Mode with verified settlement safeguards</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <Award className="text-luxury-gold shrink-0" size={24} />
            <div>
              <h4 className="text-xs uppercase tracking-luxury text-luxury-ivory font-medium">White-Glove Shipping</h4>
              <p className="text-[11px] text-luxury-champagne/70 mt-0.5">Specialized art packaging and tracked delivery</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <Landmark className="text-luxury-gold shrink-0" size={24} />
            <div>
              <h4 className="text-xs uppercase tracking-luxury text-luxury-ivory font-medium">GST Invoicing</h4>
              <p className="text-[11px] text-luxury-champagne/70 mt-0.5">Compliant Indian tax reporting & buyer records</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Col 1: Brand & Tagline */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <LogoWordmark showTagline monogramSize={42} />
          <p className="text-xs text-luxury-champagne/80 max-w-sm leading-relaxed mt-2">
            AUCTIONLY is a premier digital auction house and curated marketplace for extraordinary fine art, antiquities, luxury timepieces, and historical collectibles.
          </p>
          <div className="mt-4 flex items-center gap-2 text-[11px] text-luxury-champagne/60">
            <span>Primary Settlement Currency:</span>
            <span className="text-luxury-gold font-medium">Indian Rupee (INR ₹)</span>
          </div>
        </div>

        {/* Col 2: The 7 Departments */}
        <div>
          <h5 className="text-xs uppercase tracking-luxury text-luxury-ivory font-medium mb-4">
            Departments
          </h5>
          <ul className="flex flex-col gap-2.5 text-xs text-luxury-champagne/70">
            <li><Link href="/departments/fine-art" className="hover:text-luxury-gold transition-colors">Fine Art & Paintings</Link></li>
            <li><Link href="/departments/sculptures" className="hover:text-luxury-gold transition-colors">Sculptures & Decorative</Link></li>
            <li><Link href="/departments/antiques" className="hover:text-luxury-gold transition-colors">Antiques & History</Link></li>
            <li><Link href="/departments/numismatics" className="hover:text-luxury-gold transition-colors">Coins & Numismatics</Link></li>
            <li><Link href="/departments/watches-jewellery" className="hover:text-luxury-gold transition-colors">Watches & Jewellery</Link></li>
            <li><Link href="/departments/rare-books" className="hover:text-luxury-gold transition-colors">Books & Manuscripts</Link></li>
            <li><Link href="/departments/vintage-design" className="hover:text-luxury-gold transition-colors">Vintage Design</Link></li>
          </ul>
        </div>

        {/* Col 3: Services & Consignment */}
        <div>
          <h5 className="text-xs uppercase tracking-luxury text-luxury-ivory font-medium mb-4">
            Services
          </h5>
          <ul className="flex flex-col gap-2.5 text-xs text-luxury-champagne/70">
            <li><Link href="/studio" className="hover:text-luxury-gold transition-colors">Consign with Us</Link></li>
            <li><Link href="/studio/valuation" className="hover:text-luxury-gold transition-colors">Estimate & Valuation</Link></li>
            <li><Link href="/live" className="hover:text-luxury-gold transition-colors">Live Gala Rooms</Link></li>
            <li><Link href="/authenticity" className="hover:text-luxury-gold transition-colors">Provenance Guarantee</Link></li>
            <li><Link href="/private-sales" className="hover:text-luxury-gold transition-colors">Private Advisory</Link></li>
            <li><Link href="/shipping" className="hover:text-luxury-gold transition-colors">White-Glove Transport</Link></li>
          </ul>
        </div>

        {/* Col 4: Legal & Policies */}
        <div>
          <h5 className="text-xs uppercase tracking-luxury text-luxury-ivory font-medium mb-4">
            Governance
          </h5>
          <ul className="flex flex-col gap-2.5 text-xs text-luxury-champagne/70">
            <li><Link href="/policies/terms" className="hover:text-luxury-gold transition-colors">Terms of Service</Link></li>
            <li><Link href="/policies/buyer-agreement" className="hover:text-luxury-gold transition-colors">Buyer Terms & Premium</Link></li>
            <li><Link href="/policies/seller-agreement" className="hover:text-luxury-gold transition-colors">Seller Consignment</Link></li>
            <li><Link href="/policies/privacy" className="hover:text-luxury-gold transition-colors">Privacy Policy</Link></li>
            <li><Link href="/policies/authenticity" className="hover:text-luxury-gold transition-colors">Authenticity Policy</Link></li>
            <li><Link href="/policies/restricted" className="hover:text-luxury-gold transition-colors">Prohibited Objects</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal Notice */}
      <div className="border-t border-luxury-subtle/30 py-6 px-4 sm:px-6 lg:px-8 text-center text-[10px] tracking-wider text-luxury-muted">
        <p>
          © 2026 AUCTIONLY. All rights reserved. Private Beta Edition.
          Operating under standard Indian commercial laws and jurisdictional guidelines.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
