import { NextRequest, NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/razorpay";
import { calculateAuctionBreakdown } from "@/lib/currency";
import { mockListings } from "@/lib/data/mockCatalogue";

export async function POST(req: NextRequest) {
  try {
    const { listingId, orderType = "buy_now", buyerId = "buyer_demo_user" } = await req.json();

    if (!listingId) {
      return NextResponse.json(
        { error: "Bad Request: listingId is required." },
        { status: 400 }
      );
    }

    // Locate listing
    const listing = mockListings.find((l) => l.id === listingId || l.slug === listingId);

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

    // Determine purchase base amount in Paisa
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

    // Create authoritative order on Razorpay
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
      { error: `Order Creation Failed: ${error.message}` },
      { status: 500 }
    );
  }
}
