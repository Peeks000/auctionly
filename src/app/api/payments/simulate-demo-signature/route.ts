import { NextRequest, NextResponse } from "next/server";
import { generateServerDemoSignature } from "@/lib/razorpay";
import { getOrderByRazorpayId, getOrderByNumber } from "@/lib/ordersStore";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, payment_id } = await req.json();

    if (!razorpay_order_id || !payment_id) {
      return NextResponse.json(
        { error: "Bad Request: Missing razorpay_order_id or payment_id" },
        { status: 400 }
      );
    }

    // Verify order exists and is a demo order
    const order = getOrderByRazorpayId(razorpay_order_id) || getOrderByNumber(razorpay_order_id);
    if (!order) {
      return NextResponse.json(
        { error: "Unauthorized: Unknown order identifier" },
        { status: 404 }
      );
    }

    if (!order.isDemo) {
      return NextResponse.json(
        { error: "Forbidden: Signature simulation is restricted to Demonstration Sandbox orders" },
        { status: 403 }
      );
    }

    // Generate authoritative server signature for test execution
    const signature = generateServerDemoSignature(razorpay_order_id, payment_id);

    return NextResponse.json({
      success: true,
      signature,
      isDemo: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Simulation error: ${error.message}` },
      { status: 500 }
    );
  }
}
