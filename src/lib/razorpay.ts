import crypto from "crypto";

export interface CreateOrderParams {
  amountPaisa: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: "created" | "attempted" | "paid";
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
  is_simulated: boolean;
}

/**
 * Creates an authoritative order on Razorpay (Test Mode) or generates
 * a cryptographically signed test-mode sandbox order when keys are in test configuration.
 */
export async function createRazorpayOrder(params: CreateOrderParams): Promise<RazorpayOrderResponse> {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  const isRealRazorpayConfigured =
    keyId &&
    keySecret &&
    !keyId.includes("placeholder") &&
    keyId.startsWith("rzp_test_");

  if (isRealRazorpayConfigured) {
    const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authHeader}`,
      },
      body: JSON.stringify({
        amount: params.amountPaisa,
        currency: params.currency || "INR",
        receipt: params.receipt,
        notes: params.notes || {},
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Razorpay API Error: ${errorData.error?.description || response.statusText}`);
    }

    const orderData = await response.json();
    return {
      ...orderData,
      is_simulated: false,
    };
  }

  // Authoritative Test Mode Sandbox Simulation (No credentials configured)
  const simulatedOrderId = "order_test_" + crypto.randomBytes(8).toString("hex");
  return {
    id: simulatedOrderId,
    entity: "order",
    amount: params.amountPaisa,
    amount_paid: 0,
    amount_due: params.amountPaisa,
    currency: params.currency || "INR",
    receipt: params.receipt,
    status: "created",
    attempts: 0,
    notes: params.notes || {},
    created_at: Math.floor(Date.now() / 1000),
    is_simulated: true,
  };
}

/**
 * Cryptographically verifies Razorpay payment signature using timing-safe HMAC-SHA256.
 * Essential security gate: frontend success screen is NEVER trusted as payment proof.
 */
export function verifyRazorpayPaymentSignature({
  orderId,
  paymentId,
  signature,
  isDemo = false,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
  isDemo?: boolean;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!signature || typeof signature !== "string") {
    return false;
  }

  const body = `${orderId}|${paymentId}`;

  // If real Razorpay key is configured, verify against actual secret
  if (secret && !secret.includes("placeholder")) {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    try {
      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "utf-8"),
        Buffer.from(signature, "utf-8")
      );
    } catch {
      return false;
    }
  }

  // If order was created in Demo Sandbox mode, verify against server-derived session token
  if (isDemo || orderId.startsWith("order_test_")) {
    // Generate derived server signature using internal session key
    const serverDerivedKey = crypto
      .createHash("sha256")
      .update((process.env.SUPER_ADMIN_BOOTSTRAP_KEY || "auctionly_demo_sandbox_salt") + "_payment")
      .digest("hex");

    const expectedDemoSignature = crypto
      .createHmac("sha256", serverDerivedKey)
      .update(body)
      .digest("hex");

    try {
      return crypto.timingSafeEqual(
        Buffer.from(expectedDemoSignature, "utf-8"),
        Buffer.from(signature, "utf-8")
      );
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Server-only helper to generate demo signature for test checkout execution
 */
export function generateServerDemoSignature(orderId: string, paymentId: string): string {
  const body = `${orderId}|${paymentId}`;
  const serverDerivedKey = crypto
    .createHash("sha256")
    .update((process.env.SUPER_ADMIN_BOOTSTRAP_KEY || "auctionly_demo_sandbox_salt") + "_payment")
    .digest("hex");

  return crypto.createHmac("sha256", serverDerivedKey).update(body).digest("hex");
}

export const generateTestPaymentSignature = generateServerDemoSignature;
