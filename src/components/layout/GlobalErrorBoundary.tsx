"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("AUCTIONLY Client Safety Boundary caught exception:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-luxury-black text-luxury-ivory flex items-center justify-center p-6 selection:bg-luxury-gold selection:text-black">
          <div className="max-w-md w-full bg-luxury-dark border border-luxury-gold/40 p-8 rounded-sm text-center shadow-2xl">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-950/50 border border-amber-600/60 flex items-center justify-center text-amber-400">
              <AlertCircle size={28} />
            </div>
            <span className="text-[10px] uppercase tracking-luxury text-luxury-gold font-semibold block mb-1">
              Curatorial Saleroom Notice
            </span>
            <h2 className="font-serif text-2xl text-luxury-ivory font-light mb-3">
              Saleroom Session Restored
            </h2>
            <p className="text-xs text-luxury-champagne/70 mb-6 leading-relaxed">
              A temporary client-side display exception occurred. Your bidder credentials and session state remain completely secure.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.reload();
                }}
                className="py-2.5 px-5 bg-luxury-gold hover:bg-luxury-gold-hover text-luxury-black text-xs uppercase tracking-luxury font-semibold transition-all flex items-center gap-1.5"
              >
                <RefreshCw size={13} />
                <span>Reload Saleroom</span>
              </button>
              <Link
                href="/"
                onClick={() => this.setState({ hasError: false })}
                className="py-2.5 px-5 bg-luxury-black border border-luxury-champagne/30 hover:border-luxury-gold text-luxury-ivory text-xs uppercase tracking-luxury font-medium transition-all flex items-center gap-1.5"
              >
                <Home size={13} />
                <span>Return Home</span>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
