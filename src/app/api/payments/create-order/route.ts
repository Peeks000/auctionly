import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createRazorpayOrder } from "@/lib/razorpay";
import { calculateAuctionBreakdown } from "@/lib/currency";
import { findListing } from "@/lib/catalogueService";
import { saveOrder } from "@/lib/ordersStore";

const CreateOrderSchema = z.object({
  listingId: z.string().min(1, "listingId is required."),
  orderType: z.enum(["buy_now", "auction_win"]).default("buy_now"),
  buyerId: z.string().default("buyer_demo_user"),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const validation = CreateOrderSchema.safeParse(rawBody);

    if (!validation.success) {
      const issues = validation.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ error: `Bad Request: ${issues}` }, { status: 400 });
    }

    const { listingId, orderType, buyerId } = validation.data;

    // Locate listing in catalogue
    const listing = findListing(listingId);

    if (!listing) {
      return NextResponse.json(
        { error: "Not Found: Listing not found in catalog." },
        { status: 404 }
      );
    }

    if (listing.inventory_status !== "available") {
      return NextResponse.json(
        { error: "Conflict: Lot is no longer available for purchase." },
        { status: 409 }
      );
    }

    // Determine purchase base amount authoritatively on server
    const basePricePaisa =
      orderType === "buy_now"
        ? listing.buy_now_price || listing.starting_price
        : listing.auction?.current_price || listing.starting_price;

    // Calculate official fee breakdown
    const breakdown = calculateAuctionBreakdown({
      hammerPricePaisa: basePricePaisa,
      buyerPremiumPct: 12.0,
      gstRatePct: 18.0,
    });

    const receipt = `RCP-${Date.now().toString().slice(-6)}`;

    // Create authoritative order on Razorpay or test sandbox
    const razorpayOrder = await createRazorpayOrder({
      amountPaisa: breakdown.grandTotalPaisa,
      currency: "INR",
      receipt,
      notes: {
        listing_id: listing.id,
        listing_title: listing.title,
        order_type: orderType,
        buyer_id: buyerId,
      },
    });

    const orderNumber = `AUC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Persist authoritative order record on server
    saveOrder({
      orderNumber,
      razorpayOrderId: razorpayOrder.id,
      listingId: listing.id,
      buyerId,
      amountPaisa: breakdown.grandTotalPaisa,
      hammerPricePaisa: breakdown.hammerPricePaisa,
      buyerPremiumPaisa: breakdown.buyerPremiumPaisa,
      taxPaisa: breakdown.totalTaxPaisa,
      status: "pending",
      isDemo: razorpayOrder.is_simulated,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      orderNumber,
      razorpayOrderId: razorpayOrder.id,
      amountPaisa: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder_key",
      isSimulated: razorpayOrder.is_simulated || false,
      breakdown,
      listing: {
        id: listing.id,
        title: listing.title,
        primaryImageUrl: listing.primary_image_url,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Order Creation Failed: ${error?.message || "Internal server error"}` },
      { status: 500 }
    );
  }
}
