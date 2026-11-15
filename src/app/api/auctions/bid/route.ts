import { NextResponse } from "next/server";
import { mockListings } from "@/lib/data/mockCatalogue";
import { formatINR } from "@/lib/currency";

// In-memory runtime auction state map to preserve live bids across calls in session
const liveAuctionsState: Record<
  string,
  {
    currentPricePaisa: number;
    bidCount: number;
    highBidder: string;
    endTime: string;
    isExtended: boolean;
  }
> = {};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { listingId, slug, bidAmountPaisa, bidderId, bidderName } = body;

    if (!bidAmountPaisa || typeof bidAmountPaisa !== "number" || bidAmountPaisa <= 0) {
      return NextResponse.json(
        { error: "Invalid bid amount specified." },
        { status: 400 }
      );
    }

    // Authoritative lookup
    const listing = mockListings.find(
      (l) => l.id === listingId || (slug && l.slug === slug)
    );

    if (!listing) {
      return NextResponse.json(
        { error: "Target auction lot not found." },
        { status: 404 }
      );
    }

    const auction = listing.auction;
    if (!auction) {
      return NextResponse.json(
        { error: "This lot is not configured for active competitive bidding." },
        { status: 400 }
      );
    }

    // Initialize or read runtime state
    if (!liveAuctionsState[listing.id]) {
      liveAuctionsState[listing.id] = {
        currentPricePaisa: auction.current_price || listing.starting_price,
        bidCount: auction.bid_count || 0,
        highBidder: "Heritage Patron",
        endTime: auction.end_time || new Date(Date.now() + 86400000).toISOString(),
        isExtended: false,
      };
    }

    const currentState = liveAuctionsState[listing.id];
    const serverNow = Date.now();
    const auctionEndTimeMs = new Date(currentState.endTime).getTime();

    // Authoritative Server Clock Check
    if (serverNow >= auctionEndTimeMs) {
      return NextResponse.json(
        {
          error: "Auction has officially closed. The virtual gavel has fallen.",
          closed: true,
        },
        { status: 400 }
      );
    }

    // Minimum Increment Enforcement
    const minIncrement = auction.min_increment || 50000; // default ₹500
    const minEligibleBid = currentState.currentPricePaisa + minIncrement;

    if (bidAmountPaisa < minEligibleBid) {
      return NextResponse.json(
        {
          error: `Authoritative increment error: Bid of ${formatINR(
            bidAmountPaisa
          )} is below the minimum required increment (${formatINR(
            minEligibleBid
          )}).`,
          minEligibleBid,
          currentPrice: currentState.currentPricePaisa,
        },
        { status: 400 }
      );
    }

    // Anti-Sniping Soft Close Protocol
    // If bid is placed within final 2 minutes (120,000 ms), extend by 3 minutes (180,000 ms)
    const remainingMs = auctionEndTimeMs - serverNow;
    const isAntiSnipingTriggered = remainingMs <= 2 * 60 * 1000;
    let newEndTime = currentState.endTime;

    if (isAntiSnipingTriggered) {
      newEndTime = new Date(auctionEndTimeMs + 3 * 60 * 1000).toISOString();
      currentState.endTime = newEndTime;
      currentState.isExtended = true;
    }

    // Commit high bid to server state
    currentState.currentPricePaisa = bidAmountPaisa;
    currentState.bidCount += 1;
    currentState.highBidder = bidderName || "Verified Collector";

    const isReserveMet = listing.reserve_price
      ? bidAmountPaisa >= listing.reserve_price
      : true;

    return NextResponse.json({
      success: true,
      message: `Authoritative bid of ${formatINR(
        bidAmountPaisa
      )} accepted. You are the highest bidder.`,
      currentPricePaisa: currentState.currentPricePaisa,
      bidCount: currentState.bidCount,
      highBidder: currentState.highBidder,
      endTime: currentState.endTime,
      isExtended: currentState.isExtended,
      antiSnipingExtended: isAntiSnipingTriggered,
      isReserveMet,
      serverTimestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal bidding engine error." },
      { status: 500 }
    );
  }
}
