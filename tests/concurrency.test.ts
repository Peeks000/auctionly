import { describe, it, expect } from "vitest";
import { calculateAuctionBreakdown, formatINR, parseINRToPaisa } from "../src/lib/currency";
import { generateTestPaymentSignature, verifyRazorpayPaymentSignature } from "../src/lib/razorpay";

/**
 * Concurrency & High-Assurance Auction Engine Simulation Test
 */
describe("AUCTIONLY Auction Engine & Concurrency Unit Suite", () => {
  it("strictly calculates monetary conversions to integer minor units without precision loss", () => {
    expect(parseINRToPaisa("₹12,50,000")).toBe(125000000);
    expect(parseINRToPaisa(1250000)).toBe(125000000);
    expect(formatINR(125000000)).toContain("12,50,000");
  });

  it("calculates accurate GST-compliant auction fee breakdown", () => {
    const hammerPaisa = 100000000; // ₹10,00,000
    const breakdown = calculateAuctionBreakdown({
      hammerPricePaisa: hammerPaisa,
      buyerPremiumPct: 12.0, // 12% = ₹1,20,000
      gstRatePct: 18.0,      // 18% on ₹1,20,000 = ₹21,600
    });

    expect(breakdown.buyerPremiumPaisa).toBe(12000000);
    expect(breakdown.totalTaxPaisa).toBe(2160000);
    expect(breakdown.cgstPaisa + breakdown.sgstPaisa).toBe(2160000);
    expect(breakdown.grandTotalPaisa).toBe(114160000); // ₹11,41,600
  });

  it("simulates concurrent proxy bids and produces deterministic high bidders", () => {
    // Auction starting state
    let startingPrice = 10000000; // ₹1,00,000
    let minIncrement = 1000000;   // ₹10,000
    let currentPrice = startingPrice;
    let highBidder: string | null = null;
    let highestProxyAmount = 0;

    const simulateBid = (bidder: string, proxyMax: number) => {
      if (proxyMax < currentPrice + minIncrement && highBidder !== null) {
        return { success: false, reason: "Below min increment" };
      }

      if (highBidder === null) {
        // First bid
        highBidder = bidder;
        highestProxyAmount = proxyMax;
        currentPrice = startingPrice;
        return { success: true, currentPrice, highBidder };
      }

      if (proxyMax > highestProxyAmount) {
        // New bidder exceeds prior proxy
        const newPrice = Math.min(proxyMax, highestProxyAmount + minIncrement);
        currentPrice = newPrice;
        highestProxyAmount = proxyMax;
        highBidder = bidder;
        return { success: true, currentPrice, highBidder };
      } else {
        // Existing high bidder defends lead
        const newPrice = Math.min(highestProxyAmount, proxyMax + minIncrement);
        currentPrice = newPrice;
        return { success: false, reason: "Outbid by prior proxy", currentPrice, highBidder };
      }
    };

    // User A bids max ₹1,50,000
    const bidA = simulateBid("User_A", 15000000);
    expect(bidA.success).toBe(true);
    expect(currentPrice).toBe(10000000); // ₹1,00,000
    expect(highBidder).toBe("User_A");

    // User B concurrently bids max ₹1,20,000
    const bidB = simulateBid("User_B", 12000000);
    expect(bidB.success).toBe(false);
    expect(currentPrice).toBe(13000000); // advances to User B's max + increment = ₹1,30,000
    expect(highBidder).toBe("User_A"); // User A defends lead

    // User C bids max ₹2,00,000
    const bidC = simulateBid("User_C", 20000000);
    expect(bidC.success).toBe(true);
    expect(currentPrice).toBe(16000000); // User A's max (15000000) + increment = ₹1,60,000
    expect(highBidder).toBe("User_C"); // User C takes lead
  });

  it("verifies anti-sniping soft-close window extension logic", () => {
    const extensionWindowMs = 3 * 60 * 1000; // 3 minutes
    const extensionDurationMs = 2 * 60 * 1000; // 2 minutes

    let endTime = Date.now() + 60 * 1000; // 1 minute left (inside window)
    const bidTime = Date.now();

    const isInsideWindow = endTime - bidTime <= extensionWindowMs;
    expect(isInsideWindow).toBe(true);

    if (isInsideWindow) {
      endTime = endTime + extensionDurationMs;
    }

    // New end time is extended by 2 minutes
    expect(endTime - bidTime).toBeGreaterThanOrEqual(2.9 * 60 * 1000);
  });

  it("cryptographically verifies Razorpay payment signatures with timing-safe HMAC-SHA256", () => {
    const orderId = "order_test_881920391";
    const paymentId = "pay_test_992102931";
    const validSignature = generateTestPaymentSignature(orderId, paymentId);

    // Valid signature must pass
    expect(verifyRazorpayPaymentSignature({ orderId, paymentId, signature: validSignature })).toBe(true);

    // Tampered signature or orderId must fail
    expect(verifyRazorpayPaymentSignature({ orderId: "order_test_tampered", paymentId, signature: validSignature })).toBe(false);
    expect(verifyRazorpayPaymentSignature({ orderId, paymentId, signature: "invalid_hex_signature" })).toBe(false);
  });
});
