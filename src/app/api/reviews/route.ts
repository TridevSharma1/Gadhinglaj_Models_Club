import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ReviewModel } from "@/models/Review";
import { reviews as seedReviews } from "@/data/catalog";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const approved = searchParams.get("approved");

    // If MongoDB has 0 reviews, seed it with the default catalog reviews
    const count = await ReviewModel.countDocuments();
    if (count === 0 && seedReviews.length > 0) {
      const docs = seedReviews.map((r) => ({
        id: String(r.id),
        productId: r.productId,
        productName: r.productName || "",
        productImage: r.productImage || "",
        name: r.name,
        initials: r.initials,
        rating: r.rating,
        text: r.text,
        date: r.date,
        approved: r.approved,
      }));
      await ReviewModel.insertMany(docs);
    }

    const query: any = {};
    if (productId) {
      query.productId = Number(productId);
    }
    if (approved !== null && approved !== undefined && approved !== "") {
      query.approved = approved === "true";
    }

    const reviews = await ReviewModel.find(query).sort({ createdAt: -1, _id: -1 }).lean();
    return NextResponse.json({ success: true, reviews });
  } catch (error: any) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const { productId, productName, productImage, name, rating, text } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Your name is required." }, { status: 400 });
    }

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Feedback commentary is required." }, { status: 400 });
    }

    const validRating = Math.min(5, Math.max(1, Number(rating) || 5));

    // Generate initials from name
    const initials =
      name
        .trim()
        .split(/\s+/)
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "CL";

    const now = new Date();
    const id = body.id ? String(body.id) : `REV-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const dateStr = now.toISOString().split("T")[0];

    // Per requirement: Feedback MUST be approved first from the admin panel!
    const review = await ReviewModel.create({
      id,
      productId: productId ? Number(productId) : undefined,
      productName: productName ? String(productName).trim() : "",
      productImage: productImage ? String(productImage).trim() : "",
      name: name.trim(),
      initials,
      rating: validRating,
      text: text.trim(),
      date: dateStr,
      approved: false, // Default: Pending approval from admin panel
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your feedback! It will be published once approved by our atelier team.",
        review,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit review" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { id, approved, name, rating, text } = body;

    if (!id) {
      return NextResponse.json({ error: "Review ID required" }, { status: 400 });
    }

    const updateFields: any = {};
    if (typeof approved === "boolean") updateFields.approved = approved;
    if (name) {
      updateFields.name = name.trim();
      updateFields.initials = name
        .trim()
        .split(/\s+/)
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (rating !== undefined) updateFields.rating = Math.min(5, Math.max(1, Number(rating)));
    if (typeof text === "string") updateFields.text = text.trim();

    const review = await ReviewModel.findOneAndUpdate(
      { id: String(id) },
      { $set: updateFields },
      { new: true }
    ).lean();

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    console.error("PATCH /api/reviews error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Review ID required" }, { status: 400 });
    }

    const result = await ReviewModel.findOneAndDelete({ id: String(id) });
    if (!result) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Review deleted" });
  } catch (error: any) {
    console.error("DELETE /api/reviews error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete review" },
      { status: 500 }
    );
  }
}
