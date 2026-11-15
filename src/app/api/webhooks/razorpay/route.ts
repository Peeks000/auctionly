import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { recordWebhookEvent } from "@/lib/ordersStore";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // 1. Mandatory Signature Presence Check
    if (!signature) {
      return NextResponse.json(
        { error: "Unauthorized: Missing X-Razorpay-Signature header." },
        { status: 400 }
      );
    }

    // 2. Webhook Secret Configuration Check (No hardcoded fallback secrets)
    if (!webhookSecret || webhookSecret.includes("placeholder")) {
      return NextResponse.json(
        { error: "Configuration Error: RAZORPAY_WEBHOOK_SECRET is not configured on the server." },
        { status: 500 }
      );
    }

    // 3. Cryptographic Signature Verification
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    let isValid = false;
    try {
      isValid = crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "utf-8"),
        Buffer.from(signature, "utf-8")
      );
    } catch {
      isValid = false;
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Security Error: Invalid webhook signature." },
        { status: 400 }
      );
    }

    // 4. Parse Event Body & Extract Event ID
    const event = JSON.parse(rawBody);
    const eventId = event.event_id || event.id;

    if (!eventId) {
      return NextResponse.json(
        { error: "Bad Request: Missing event_id in webhook payload." },
        { status: 400 }
      );
    }

    // 5. Durable Database-Backed Idempotency Protection
    const isNewEvent = recordWebhookEvent(eventId);
    if (!isNewEvent) {
      return NextResponse.json(
        { status: "already_processed", message: "Event already handled." },
        { status: 200 }
      );
    }

    // 6. Handle Known Webhook Events
    switch (event.event) {
      case "payment.captured":
        // Order fulfillment & ledger update
        break;
      case "payment.failed":
        // Log failed payment notice
        break;
      case "order.paid":
        // Mark auction item closed
        break;
      default:
        break;
    }

    return NextResponse.json({ success: true, event: event.event }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Webhook Handling Error: ${error.message}` },
      { status: 500 }
    );
  }
}
