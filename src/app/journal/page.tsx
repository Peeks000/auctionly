import React from "react";
import Link from "next/link";
import { BookOpen, Calendar, ArrowRight, ShieldCheck } from "lucide-react";

export default function JournalPage() {
  const articles = [
    {
      id: "art-1",
      title: "The Architecture of Patek Philippe's Reference 2499",
      subtitle: "Tracing the four series of mid-century perpetual calendar chronographs.",
      author: "Horological Specialist Desk",
      date: "November 2026",
      readTime: "8 min read",
      department: "Watches & Jewellery",
      imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
      excerpt:
        "Introduced in 1950 to succeed the legendary Reference 1518, the Patek Philippe 2499 remains the undisputed benchmark of classical complication architecture. Across 35 years of production, barely 349 examples were completed in all precious metals.",
    },
    {
      id: "art-2",
      title: "M.F. Husain and the Vitality of the Sun Chariot",
      subtitle: "Why the equestrian motif defined post-independence Indian Modernism.",
      author: "Modern & Contemporary Indian Art Desk",
      date: "October 2026",
      readTime: "6 min read",
      department: "Fine Art & Paintings",
      imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
      excerpt:
        "Husain’s fascination with horses began during his childhood in Indore, where he witnessed the ceremonial Muharram horses. In his monumental 1970s canvases, these beasts evolve into cosmic conduits of primeval energy and mythological power.",
    },
    {
      id: "art-3",
      title: "Conserving the Sacred: ASI Compliance and Chola Bronzes",
      subtitle: "Legal frameworks and curatorial protocols for Indian registered antiquities.",
      author: "Legal & Provenance Advisory",
      date: "September 2026",
      readTime: "10 min read",
      department: "Antiques & Sculptures",
      imageUrl: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1200&q=80",
      excerpt:
        "The Antiquities and Art Treasures Act of 1972 establishes strict national custody for objects over one hundred years old. AUCTIONLY outlines the mandatory Form V registration and transfer documentation required for lawful domestic acquisition.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-12">
      <div className="border-b border-luxury-champagne/15 pb-8 flex flex-col gap-3">
        <span className="text-xs uppercase tracking-luxury text-luxury-gold font-medium flex items-center gap-2">
          <BookOpen size={14} />
          <span>Curatorial Essays & Scholarship</span>
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-luxury-ivory font-medium">
          The AUCTIONLY Journal
        </h1>
        <p className="text-xs sm:text-sm text-luxury-champagne/80 font-sans max-w-2xl leading-relaxed">
          Critical essays, market analysis, and provenance research authored by our department heads and independent scholars.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {articles.map((article, idx) => (
          <article
            key={article.id}
            className="card-luxury p-8 flex flex-col md:flex-row gap-8 items-center group hover:border-luxury-gold/50 transition-all duration-300"
          >
            <div className="w-full md:w-80 h-56 relative rounded-sm overflow-hidden shrink-0 bg-luxury-dark">
              <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>

            <div className="flex flex-col gap-3 flex-1">
              <div className="flex items-center gap-3 text-[11px] text-luxury-champagne/70 uppercase tracking-wider">
                <span className="text-luxury-gold font-medium">{article.department}</span>
                <span>•</span>
                <span>{article.date}</span>
                <span>•</span>
                <span>{article.readTime}</span>
              </div>

              <h2 className="font-serif text-2xl text-luxury-ivory font-medium group-hover:text-luxury-gold transition-colors">
                {article.title}
              </h2>

              <p className="text-xs sm:text-sm text-luxury-champagne/80 leading-relaxed font-sans">
                {article.excerpt}
              </p>

              <div className="pt-2 flex items-center justify-between text-xs border-t border-luxury-subtle/30 mt-2">
                <span className="text-luxury-muted text-[11px]">By {article.author}</span>
                <span className="text-luxury-gold text-xs uppercase tracking-wider font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Essay <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
