"use client";

import React, { useState } from "react";
import { mockListings } from "@/lib/data/mockCatalogue";
import { formatINR } from "@/lib/currency";
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  ShieldCheck,
  Compass,
  AlertCircle,
} from "lucide-react";

export const AiConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<
    { sender: "user" | "concierge"; text: string; time: string }[]
  >([
    {
      sender: "concierge",
      text: "Greetings. I am the AUCTIONLY Curatorial Concierge. I can assist you with provenance inquiries, upcoming marquee lots, auction rules, or specialist departments. How may I be of service?",
      time: "Just now",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => [...prev, { sender: "user", text: userText, time: now }]);
    setInputMessage("");
    setIsTyping(true);

    // Grounded knowledge response engine
    setTimeout(() => {
      const q = userText.toLowerCase();
      let reply = "";

      if (q.includes("watch") || q.includes("patek")) {
        const watch = mockListings.find((l) => l.category_id === "cat-5" && l.title.includes("Patek"));
        reply = `In our Watches & Jewellery department, we are featuring Lot 12: "${watch?.title}". Preserved in collector mint condition with original Patek Philippe archive certificates. The starting ask is ${formatINR(watch?.starting_price || 0)}.`;
      } else if (q.includes("art") || q.includes("husain") || q.includes("painting")) {
        const art = mockListings.find((l) => l.title.includes("Husain"));
        reply = `From 20th-century Asian Modernism, we currently have Maqbool Fida Husain's monumental 1972 oil "${art?.title}". Current bid stands at ${formatINR(art?.auction?.current_price || 0)} with verified gallery provenance.`;
      } else if (q.includes("bronze") || q.includes("chola") || q.includes("sculpture")) {
        reply = `Our Sculptures department features an exceptional 11th-century Chola Dynasty Bronze Somaskanda. Please note that as a registered Indian Antiquity under ASI Act 1972, this lot is available strictly for domestic acquisition within India.`;
      } else if (q.includes("reserve") || q.includes("snip") || q.includes("bid")) {
        reply = `On AUCTIONLY, all bidding is authoritative and server-clock validated. Maximum proxy bids remain strictly private. If an eligible bid arrives within the final 3 minutes, the anti-sniping extension automatically adds 2 minutes to the clock.`;
      } else {
        reply = `AUCTIONLY curates 7 premier departments: Fine Art, Sculptures, Antiques, Coins, Watches, Rare Books, and Vintage Design. You can explore active timed auctions in Indian Rupees (₹) with guaranteed curatorial provenance.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "concierge",
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 bg-luxury-dark/95 hover:bg-luxury-gold text-luxury-gold hover:text-luxury-black border border-luxury-gold/50 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-300 group"
          aria-label="Open AI Curatorial Concierge"
        >
          <Sparkles size={16} className="text-luxury-gold group-hover:text-luxury-black animate-pulse" />
          <span className="text-xs uppercase tracking-luxury font-medium font-sans">
            Curatorial Concierge
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-luxury-black/95 border border-luxury-gold/40 rounded-sm shadow-2xl backdrop-blur-xl flex flex-col justify-between overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-luxury-dark/90 p-4 border-b border-luxury-champagne/15 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-luxury-gold/20 border border-luxury-gold flex items-center justify-center text-luxury-gold">
                <Sparkles size={14} />
              </div>
              <div>
                <h4 className="font-serif text-sm text-luxury-ivory font-medium">AUCTIONLY Concierge</h4>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Grounded in Catalogue</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-luxury-champagne hover:text-luxury-ivory"
              aria-label="Close Concierge"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 text-xs leading-relaxed">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`p-3 rounded-sm max-w-[85%] ${
                    m.sender === "user"
                      ? "bg-luxury-gold text-luxury-black font-medium"
                      : "bg-luxury-dark/90 text-luxury-champagne border border-luxury-champagne/15"
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <span className="text-[9px] text-luxury-muted mt-1 px-1">{m.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-luxury-gold text-[10px] italic p-2">
                <Sparkles size={12} className="animate-spin" />
                <span>Consulting curatorial records...</span>
              </div>
            )}
          </div>

          {/* Input Field */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-luxury-dark/80 border-t border-luxury-champagne/15 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about lots, provenance, or bidding..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-luxury-black border border-luxury-subtle/50 rounded-sm px-3 py-2 text-xs text-luxury-ivory focus:border-luxury-gold focus:outline-none placeholder-luxury-muted"
            />
            <button
              type="submit"
              className="p-2 bg-luxury-gold text-luxury-black hover:bg-luxury-goldLight transition-colors rounded-sm"
              aria-label="Send message"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AiConcierge;
