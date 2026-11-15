/**
 * AUCTIONLY Financial & Currency Precision Engine
 * All monetary amounts are internally represented as integer minor units (Paisa).
 * 1 Indian Rupee (INR) = 100 Paisa.
 * Avoids IEEE 754 floating point inaccuracies.
 */

/**
 * Format integer Paisa into standard Indian Rupee notation (e.g., ₹12,50,000)
 */
export function formatINR(paisa: number, includeDecimals = false): string {
  if (isNaN(paisa) || paisa === null || paisa === undefined) {
    return "₹0";
  }

  const rupees = paisa / 100;

  if (includeDecimals) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(rupees);
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
}

/**
 * Convert user string input (e.g., "1250000" or "12,50,000") to integer Paisa
 */
export function parseINRToPaisa(input: string | number): number {
  if (typeof input === "number") {
    return Math.round(input * 100);
  }

  const sanitized = input.replace(/[₹,\s]/g, "");
  const value = parseFloat(sanitized);

  if (isNaN(value)) {
    return 0;
  }

  return Math.round(value * 100);
}

/**
 * Calculate standard auction fee breakdown
 * @param hammerPricePaisa Winning bid in paisa
 * @param buyerPremiumPct e.g., 12.00 (12%)
 * @param gstRatePct e.g., 18.00 (18% GST applicable on the service fee)
 */
export function calculateAuctionBreakdown({
  hammerPricePaisa,
  buyerPremiumPct = 12.0,
  gstRatePct = 18.0,
  isInterState = false,
}: {
  hammerPricePaisa: number;
  buyerPremiumPct?: number;
  gstRatePct?: number;
  isInterState?: boolean;
}) {
  const buyerPremiumPaisa = Math.round(hammerPricePaisa * (buyerPremiumPct / 100));
  const totalTaxPaisa = Math.round(buyerPremiumPaisa * (gstRatePct / 100));

  let cgstPaisa = 0;
  let sgstPaisa = 0;
  let igstPaisa = 0;

  if (isInterState) {
    igstPaisa = totalTaxPaisa;
  } else {
    cgstPaisa = Math.round(totalTaxPaisa / 2);
    sgstPaisa = totalTaxPaisa - cgstPaisa; // Balance guarantees exact sum
  }

  const grandTotalPaisa = hammerPricePaisa + buyerPremiumPaisa + totalTaxPaisa;

  return {
    hammerPricePaisa,
    buyerPremiumPaisa,
    buyerPremiumPct,
    cgstPaisa,
    sgstPaisa,
    igstPaisa,
    totalTaxPaisa,
    grandTotalPaisa,
  };
}
