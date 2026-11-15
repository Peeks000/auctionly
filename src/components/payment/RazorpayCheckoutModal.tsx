"use client";

import React, { useState } from "react";
import { formatINR } from "@/lib/currency";
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  X,
  Lock,
  Download,
  Building,
  Smartphone,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

interface RazorpayCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: {
    id: string;
    title: string;
    primary_image_url?: string;
    primaryImageUrl?: string;
    buyNowPrice?: number | null;
    buy_now_price?: number | null;
    currentPrice?: number | null;
  };
  orderType?: "buy_now" | "auction_win";
  onSuccess?: (orderData: any) => void;
}

export const RazorpayCheckoutModal: React.FC<RazorpayCheckoutModalProps> = ({
  isOpen,
  onClose,
  listing,
  orderType = "buy_now",
  onSuccess,
}) => {
  const [step, setStep] = useState<"checkout" | "processing" | "success" | "failed">("checkout");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("collector@okhdfcbank");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<any>(null);

  if (!isOpen) return null;

  const basePricePaisa = listing.buyNowPrice || listing.buy_now_price || listing.currentPrice || 50000000;
  const buyerPremiumPaisa = Math.round(basePricePaisa * 0.12);
  const gstPaisa = Math.round(buyerPremiumPaisa * 0.18);
  const totalPaisa = basePricePaisa + buyerPremiumPaisa + gstPaisa;

  // Execute Authoritative Checkout
  const handlePay = async (simulateFailure = false) => {
    setStep("processing");
    setErrorMessage(null);

    try {
      // 1. Authoritative Server-side Order Creation
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          orderType,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Failed to create order on server.");

      if (simulateFailure) {
        throw new Error("Bank Gateway Simulation: Transaction declined by issuing bank (Test Simulation).");
      }

      // 2. Obtain payment token from server
      const testPaymentId = "pay_test_" + Math.random().toString(36).substring(2, 12);

      const sigRes = await fetch("/api/payments/simulate-demo-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: orderData.razorpayOrderId,
          payment_id: testPaymentId,
        }),
      });

      const sigData = await sigRes.json();
      if (!sigRes.ok) throw new Error(sigData.error || "Failed to generate authorization signature.");

      // 3. Server-side Cryptographic Signature Verification
      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: orderData.razorpayOrderId,
          razorpay_payment_id: testPaymentId,
          razorpay_signature: sigData.signature,
          orderNumber: orderData.orderNumber,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || "Server payment verification failed.");

      setOrderResult({
        ...verifyData,
        orderNumber: orderData.orderNumber,
        totalPaisa,
        paymentId: testPaymentId,
      });

      setStep("success");
      if (onSuccess) onSuccess(verifyData);
    } catch (err: any) {
      setErrorMessage(err.message);
      setStep("failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-luxury-dark border border-luxury-gold/40 rounded-sm shadow-2xl overflow-hidden text-luxury-ivory">
        {/* Top Razorpay Test Mode Advisory Strip */}
        <div className="bg-amber-950/80 border-b border-amber-800/60 px-4 py-2 flex items-center justify-between text-[11px] text-amber-200">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-amber-400" />
            <span className="font-semibold uppercase tracking-wider">Razorpay Sandbox (Test Mode)</span>
          </div>
          <span className="text-[10px] text-amber-300/80">Beta Sandbox • No Real Charges</span>
        </div>

        {/* Modal Header */}
        <div className="p-6 border-b border-luxury-champagne/15 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-luxury-black border border-luxury-gold/50 flex items-center justify-center text-luxury-gold">
              <CreditCard size={20} />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-luxury text-luxury-gold block font-semibold">
                Authoritative Checkout
              </span>
              <h3 className="font-serif text-lg font-medium text-luxury-ivory truncate max-w-xs">
                {listing.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-luxury-champagne hover:text-luxury-ivory transition-colors"
            aria-label="Close Checkout"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-5">
          {step === "checkout" && (
            <>
              {/* Price Breakdown */}
              <div className="p-4 bg-luxury-black/60 border border-luxury-subtle/50 rounded-sm text-xs flex flex-col gap-2">
                <div className="flex justify-between text-luxury-champagne/80">
                  <span>Hammer / Acquisition Base:</span>
                  <span className="font-mono">{formatINR(basePricePaisa)}</span>
                </div>
                <div className="flex justify-between text-luxury-champagne/80">
                  <span>Buyer&apos;s Premium (12%):</span>
                  <span className="font-mono">{formatINR(buyerPremiumPaisa)}</span>
                </div>
                <div className="flex justify-between text-luxury-champagne/80">
                  <span>GST (18% on Buyer Premium):</span>
                  <span className="font-mono">{formatINR(gstPaisa)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-luxury-subtle/40 font-semibold text-sm text-luxury-ivory">
                  <span>Total Payable Amount (INR):</span>
                  <span className="font-mono text-luxury-gold">{formatINR(totalPaisa)}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-luxury text-luxury-champagne font-medium">
                  Select Test Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-3 border rounded-sm text-xs flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === "upi"
                        ? "border-luxury-gold bg-luxury-gold/15 text-luxury-gold font-semibold"
                        : "border-luxury-subtle bg-luxury-black/40 text-luxury-champagne/70"
                    }`}
                  >
                    <Smartphone size={16} />
                    <span>UPI / QR</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-3 border rounded-sm text-xs flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === "card"
                        ? "border-luxury-gold bg-luxury-gold/15 text-luxury-gold font-semibold"
                        : "border-luxury-subtle bg-luxury-black/40 text-luxury-champagne/70"
                    }`}
                  >
                    <CreditCard size={16} />
                    <span>Cards (Test)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("netbanking")}
                    className={`p-3 border rounded-sm text-xs flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === "netbanking"
                        ? "border-luxury-gold bg-luxury-gold/15 text-luxury-gold font-semibold"
                        : "border-luxury-subtle bg-luxury-black/40 text-luxury-champagne/70"
                    }`}
                  >
                    <Building size={16} />
                    <span>Netbanking</span>
                  </button>
                </div>
              </div>

              {/* Method Details */}
              {paymentMethod === "upi" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-luxury-muted">Simulated UPI VPA:</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-luxury-black border border-luxury-subtle p-2.5 text-xs text-luxury-ivory font-mono focus:border-luxury-gold outline-none"
                  />
                  <span className="text-[10px] text-luxury-muted">Use any test VPA (e.g., success@razorpay)</span>
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="p-3 bg-luxury-black/60 border border-luxury-subtle/50 text-xs font-mono text-luxury-champagne/80 flex flex-col gap-1">
                  <span>Test Card: 4111 •••• •••• 1111</span>
                  <span className="text-[10px] text-luxury-muted">Expiry: 12/28 • CVV: 123 • OTP: Any 6 digits</span>
                </div>
              )}

              {paymentMethod === "netbanking" && (
                <div className="p-3 bg-luxury-black/60 border border-luxury-subtle/50 text-xs text-luxury-champagne/80 flex items-center justify-between">
                  <span>HDFC / ICICI / SBI Sandbox Bank Gateway</span>
                  <span className="text-emerald-400 text-[10px]">Instant Authorization</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handlePay(false)}
                  className="w-full py-3.5 bg-luxury-gold hover:bg-luxury-goldLight text-luxury-black font-semibold text-xs uppercase tracking-luxury transition-all flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(198,166,106,0.3)]"
                >
                  <Lock size={14} />
                  <span>Pay {formatINR(totalPaisa)} with Razorpay Test Mode</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePay(true)}
                  className="w-full py-2 bg-transparent hover:bg-red-950/30 text-red-400 hover:text-red-300 text-[11px] uppercase tracking-wider transition-colors border border-red-900/40"
                >
                  Test Payment Failure Handling
                </button>
              </div>
            </>
          )}

          {step === "processing" && (
            <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
              <RefreshCw size={36} className="text-luxury-gold animate-spin" />
              <h4 className="font-serif text-lg text-luxury-ivory font-medium">Validating Server Order...</h4>
              <p className="text-xs text-luxury-champagne/70 max-w-xs leading-relaxed">
                Communicating with authoritative server API and performing cryptographic HMAC-SHA256 signature verification.
              </p>
            </div>
          )}

          {step === "success" && orderResult && (
            <div className="flex flex-col gap-4 text-center animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-950/60 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h4 className="font-serif text-xl font-medium text-luxury-ivory">Payment Authorized & Captured</h4>
                <p className="text-xs text-luxury-champagne/80 mt-1">
                  Cryptographic signature verified by server. Inventory reserved.
                </p>
                {orderResult.isDemo && (
                  <span className="mt-1 inline-block text-[10px] uppercase tracking-wider text-amber-300 bg-amber-950/40 px-2 py-0.5 border border-amber-800/40">
                    Demonstration Sandbox Mode
                  </span>
                )}
              </div>

              <div className="p-4 bg-luxury-black/70 border border-luxury-subtle text-xs text-left flex flex-col gap-2 rounded-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-luxury-muted">Order Number:</span>
                  <span className="text-luxury-ivory font-semibold">{orderResult.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury-muted">Payment ID:</span>
                  <span className="text-luxury-gold">{orderResult.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury-muted">GST Invoice:</span>
                  <span className="text-luxury-ivory">{orderResult.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury-muted">Settlement Net Payout:</span>
                  <span className="text-emerald-400">{formatINR(orderResult.settlement?.netPayoutPaisa || 0)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => alert(`Downloading GST Tax Invoice PDF (${orderResult.invoiceNumber})...`)}
                  className="flex-1 py-3 bg-luxury-gold hover:bg-luxury-goldLight text-luxury-black font-semibold text-xs uppercase tracking-luxury flex items-center justify-center gap-2"
                >
                  <Download size={14} />
                  <span>Download Tax Invoice</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-luxury-champagne/30 hover:border-luxury-gold text-luxury-ivory text-xs uppercase tracking-luxury"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {step === "failed" && (
            <div className="flex flex-col gap-4 text-center animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-red-950/60 border-2 border-red-500 text-red-400 flex items-center justify-center mx-auto">
                <AlertTriangle size={32} />
              </div>
              <div>
                <h4 className="font-serif text-xl font-medium text-luxury-ivory">Payment Not Completed</h4>
                <p className="text-xs text-red-300 mt-1 max-w-xs mx-auto leading-relaxed">
                  {errorMessage || "Transaction could not be authorized. No funds were debited."}
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={() => setStep("checkout")}
                  className="flex-1 py-3 bg-luxury-gold text-luxury-black font-semibold text-xs uppercase tracking-luxury"
                >
                  Retry Payment
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-luxury-subtle text-luxury-champagne text-xs uppercase tracking-luxury"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RazorpayCheckoutModal;
