import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory set for event deduplication in serverless runtime
const processedEvents = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "auctionly_webhook_secret_2026";

    // 1. Signature check
    if (signature) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      const isValid = crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "utf-8"),
        Buffer.from(signature, "utf-8")
      );

      if (!isValid) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);
    const eventId = event.event_id || event.id;

    // 2. Idempotency Check: Prevent duplicate order processing
    if (eventId && processedEvents.has(eventId)) {
      return NextResponse.json({ status: "already_processed" }, { status: 200 });
    }

    if (eventId) {
      processedEvents.add(eventId);
    }

    // 3. Process event type
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
