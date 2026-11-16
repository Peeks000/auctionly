import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyRazorpayPaymentSignature } from "@/lib/razorpay";
import { getOrderByRazorpayId, getOrderByNumber, updateOrderStatus } from "@/lib/ordersStore";

const VerifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1, "razorpay_order_id is required."),
  razorpay_payment_id: z.string().min(1, "razorpay_payment_id is required."),
  razorpay_signature: z.string().min(1, "razorpay_signature is required."),
  orderNumber: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const validation = VerifyPaymentSchema.safeParse(rawBody);

    if (!validation.success) {
      const issues = validation.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json(
        { error: `Bad Request: Missing required Razorpay payment verification parameters. (${issues})` },
        { status: 400 }
      );
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderNumber,
    } = validation.data;

    // 1. Authoritative Server Lookup: Locate order by Razorpay ID or Order Number
    const existingOrder =
      getOrderByRazorpayId(razorpay_order_id) || (orderNumber ? getOrderByNumber(orderNumber) : undefined);

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Unauthorized: No matching order record found on server. Transaction untrusted." },
        { status: 404 }
      );
    }

    if (existingOrder.status === "captured") {
      return NextResponse.json(
        {
          success: true,
          verified: true,
          status: "already_captured",
          orderNumber: existingOrder.orderNumber,
          invoiceNumber: existingOrder.invoiceNumber,
          message: "Order already verified and invoiced.",
        },
        { status: 200 }
      );
    }

    // 2. Authoritative Server Cryptographic Signature Verification
    const isValid = verifyRazorpayPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      isDemo: existingOrder.isDemo,
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

    // 3. Authoritative Amount Source of Truth: NEVER trust client-submitted amount
    const authoritativeAmountPaisa = existingOrder.amountPaisa;
    const invoiceNumber = `INV-IN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const invoiceDate = new Date().toISOString();

    // 4. Compute Seller Settlement Ledger Accrual on Authoritative Server Amount
    // Platform commission (8%) and Indian Section 194-O TDS (1%)
    const commissionPaisa = Math.round(authoritativeAmountPaisa * 0.08);
    const tdsPaisa = Math.round(authoritativeAmountPaisa * 0.01);
    const netSellerPayoutPaisa = authoritativeAmountPaisa - commissionPaisa - tdsPaisa;

    // 5. Update Persistent Order State
    updateOrderStatus(existingOrder.orderNumber, {
      status: "captured",
      paymentId: razorpay_payment_id,
      capturedAt: invoiceDate,
      invoiceNumber,
    });

    return NextResponse.json({
      success: true,
      verified: true,
      status: "captured",
      orderNumber: existingOrder.orderNumber,
      paymentId: razorpay_payment_id,
      invoiceNumber,
      invoiceDate,
      isDemo: existingOrder.isDemo,
      settlement: {
        grossAmountPaisa: authoritativeAmountPaisa,
        commissionPaisa,
        tdsPaisa,
        netPayoutPaisa: netSellerPayoutPaisa,
        payoutStatus: "accrued",
      },
      message: existingOrder.isDemo
        ? "Payment verified in Demonstration Sandbox Mode. Test invoice generated (No real bank charges)."
        : "Payment verified authoritatively with Razorpay signature. Invoice dispatched.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Payment Verification Internal Error: ${error?.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
