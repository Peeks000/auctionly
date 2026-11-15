import { NextResponse } from "next/server";
import { z } from "zod";

const ConsignmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  category: z.string().min(1, "Category is required."),
  artist: z.string().optional(),
  period: z.string().optional(),
  materials: z.string().optional(),
  dimensions: z.string().optional(),
  conditionGrade: z.string().default("Excellent"),
  conditionReport: z.string().optional(),
  provenance: z.string().optional(),
  startingPrice: z.number().positive("Starting price must be a positive amount."),
  reservePrice: z.number().positive().optional().nullable(),
  buyNowPrice: z.number().positive().optional().nullable(),
  saleFormat: z.string().default("timed_auction"),
  sellerEmail: z.string().email("Valid consignor contact email is required."),
  sellerName: z.string().optional(),
  sellerPhone: z.string().optional(),
  imageCount: z.number().default(0),
});

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();

    // Validate using Zod
    const validation = ConsignmentSchema.safeParse(rawBody);

    if (!validation.success) {
      const issues = validation.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ error: issues }, { status: 400 });
    }

    const data = validation.data;

    // Check reserve price consistency: reserve price cannot be lower than starting price
    if (data.reservePrice && data.reservePrice < data.startingPrice) {
      return NextResponse.json(
        {
          error: "Reserve price cannot be set below the opening starting bid.",
        },
        { status: 400 }
      );
    }

    // Check buy now consistency if set
    if (data.buyNowPrice && data.buyNowPrice < data.startingPrice) {
      return NextResponse.json(
        {
          error: "Buy Now price cannot be lower than the starting bid.",
        },
        { status: 400 }
      );
    }

    const consignmentNumber =
      "CSG-" +
      new Date().getFullYear() +
      "-" +
      Math.floor(100000 + Math.random() * 900000);

    const submissionRecord = {
      consignmentNumber,
      status: "pending_curatorial_review",
      submittedAt: new Date().toISOString(),
      item: {
        title: data.title,
        category: data.category,
        artist: data.artist || "Unspecified / School",
        period: data.period || "Heritage Unrecorded",
        materials: data.materials || "Natural Materials",
        conditionGrade: data.conditionGrade,
        startingPricePaisa: Math.round(data.startingPrice * 100),
        reservePricePaisa: data.reservePrice ? Math.round(data.reservePrice * 100) : null,
        buyNowPricePaisa: data.buyNowPrice ? Math.round(data.buyNowPrice * 100) : null,
      },
      seller: {
        email: data.sellerEmail,
        name: data.sellerName || "Consignor Partner",
        phone: data.sellerPhone || null,
      },
      imageCount: data.imageCount,
      estimatedReviewWindowHours: 48,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Consignment successfully registered in AUCTIONLY curatorial intake queue.",
        consignment: submissionRecord,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error during consignment intake." },
      { status: 500 }
    );
  }
}
