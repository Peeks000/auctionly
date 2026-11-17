import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AiConcierge from "@/components/ai/AiConcierge";
import GlobalErrorBoundary from "@/components/layout/GlobalErrorBoundary";
import CustomCursor from "@/components/ui/CustomCursor";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "AUCTIONLY — Own the Extraordinary.",
  description:
    "A premier digital auction house and curated marketplace for exceptional fine art, rare antiquities, vintage horology, and high-value collectibles. India-first with authoritative INR settlement.",
  keywords: [
    "Luxury Auction",
    "Fine Art",
    "Antiques",
    "Rare Watches",
    "Numismatics",
    "Jewellery",
    "India Luxury Marketplace",
    "Sotheby's India Alternative",
  ],
  authors: [{ name: "AUCTIONLY Curatorial House" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-luxury-black text-luxury-ivory flex flex-col selection:bg-luxury-gold selection:text-luxury-black">
        <GlobalErrorBoundary>
          <CustomCursor />
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <AiConcierge />
          <Footer />
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
