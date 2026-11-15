import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpayPaymentSignature } from "@/lib/razorpay";
import { calculateAuctionBreakdown, formatINR } from "@/lib/currency";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderNumber,
      listingId,
      amountPaisa,
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Bad Request: Missing required Razorpay payment credentials for verification." },
        { status: 400 }
      );
    }

    // 1. Authoritative Server Signature Verification
    const isValid = verifyRazorpayPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      return NextResponse.json(
        {
          error: "Payment Security Verification Failed: Cryptographic signature mismatch. Transaction untrusted.",
          verified: false,
        },
        { status: 400 }
      );
    }

    // 2. Generate Compliant GST Invoice Record
    const invoiceNumber = `INV-IN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const invoiceDate = new Date().toISOString();

    // 3. Compute Seller Settlement Ledger Accrual
    // Base amount minus 8% platform consignment commission and 1% Indian Section 194-O TDS
    const commissionPaisa = Math.round(amountPaisa * 0.08);
    const tdsPaisa = Math.round(amountPaisa * 0.01);
    const netSellerPayoutPaisa = amountPaisa - commissionPaisa - tdsPaisa;

    return NextResponse.json({
      success: true,
      verified: true,
      status: "captured",
      orderNumber,
      paymentId: razorpay_payment_id,
      invoiceNumber,
      invoiceDate,
      settlement: {
        grossAmountPaisa: amountPaisa,
        commissionPaisa,
        tdsPaisa,
        netPayoutPaisa: netSellerPayoutPaisa,
        payoutStatus: "accrued",
      },
      message: "Payment successfully verified by authoritative server signature check. Order invoiced.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Payment Verification Exception: ${error.message}` },
      { status: 500 }
    );
  }
}
