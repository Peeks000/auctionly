import { describe, it, expect } from "vitest";
import { formatCountdownDifference } from "../src/lib/hooks/useCountdown";
import { z } from "zod";

describe("AUCTIONLY Hooks & API Schemas Unit Tests", () => {
  describe("formatCountdownDifference", () => {
    it("returns empty string and isClosed false for null/undefined endTime", () => {
      expect(formatCountdownDifference(null)).toEqual({
        timeLeft: "",
        isClosed: false,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
      expect(formatCountdownDifference(undefined)).toEqual({
        timeLeft: "",
        isClosed: false,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    });

    it("returns 'Closed' and isClosed true for timestamps in the past", () => {
      const past = new Date(Date.now() - 10000).toISOString();
      const result = formatCountdownDifference(past);
      expect(result.timeLeft).toBe("Closed");
      expect(result.isClosed).toBe(true);
    });

    it("formats days and hours when difference > 24 hours", () => {
      // 2 days and 5 hours in future
      const future = new Date(Date.now() + (2 * 24 + 5) * 60 * 60 * 1000 + 10000).toISOString();
      const result = formatCountdownDifference(future);
      expect(result.isClosed).toBe(false);
      expect(result.days).toBe(2);
      expect(result.timeLeft).toContain("2d");
      expect(result.timeLeft).toContain("left");
    });

    it("formats hours, minutes, and seconds when difference < 24 hours", () => {
      // 3 hours and 15 minutes in future
      const future = new Date(Date.now() + (3 * 60 + 15) * 60 * 1000 + 30 * 1000).toISOString();
      const result = formatCountdownDifference(future);
      expect(result.isClosed).toBe(false);
      expect(result.days).toBe(0);
      expect(result.hours).toBe(3);
      expect(result.minutes).toBe(15);
      expect(result.timeLeft).toMatch(/\d+h \d+m \d+s/);
    });
  });

  describe("API Validation Schemas", () => {
    const PlaceBidSchema = z
      .object({
        listingId: z.string().optional(),
        slug: z.string().optional(),
        bidAmountPaisa: z.number().int().positive(),
        bidderId: z.string().optional(),
        bidderName: z.string().optional(),
      })
      .refine((data) => data.listingId || data.slug, {
        message: "Either listingId or slug must be specified.",
      });

    it("accepts valid bid with listingId and positive integer amount", () => {
      const valid = PlaceBidSchema.safeParse({
        listingId: "list-1",
        bidAmountPaisa: 15000000,
        bidderName: "Patron 1",
      });
      expect(valid.success).toBe(true);
    });

    it("rejects bids with zero or negative amounts", () => {
      const zero = PlaceBidSchema.safeParse({
        listingId: "list-1",
        bidAmountPaisa: 0,
      });
      expect(zero.success).toBe(false);

      const negative = PlaceBidSchema.safeParse({
        listingId: "list-1",
        bidAmountPaisa: -500,
      });
      expect(negative.success).toBe(false);
    });

    it("rejects bids missing both listingId and slug", () => {
      const missingKey = PlaceBidSchema.safeParse({
        bidAmountPaisa: 100000,
      });
      expect(missingKey.success).toBe(false);
    });

    const VerifyPaymentSchema = z.object({
      razorpay_order_id: z.string().min(1),
      razorpay_payment_id: z.string().min(1),
      razorpay_signature: z.string().min(1),
      orderNumber: z.string().optional(),
    });

    it("rejects payment verification when required parameters are missing", () => {
      const missingSig = VerifyPaymentSchema.safeParse({
        razorpay_order_id: "order_123",
        razorpay_payment_id: "pay_123",
      });
      expect(missingSig.success).toBe(false);
    });

    it("accepts complete payment verification payload", () => {
      const complete = VerifyPaymentSchema.safeParse({
        razorpay_order_id: "order_123",
        razorpay_payment_id: "pay_123",
        razorpay_signature: "sig_abc",
        orderNumber: "AUC-2025-001",
      });
      expect(complete.success).toBe(true);
    });
  });
});
