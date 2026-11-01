import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { SiteContentModel } from "@/models/SiteContent";
import { siteContent as defaultContent } from "@/data/catalog";

export async function GET() {
  try {
    await connectToDatabase();
    let doc = await SiteContentModel.findOne({ key: "default" }).lean();

    if (!doc) {
      const created = await SiteContentModel.create({
        key: "default",
        ...defaultContent,
      });
      doc = created.toObject();
    }

    return NextResponse.json({ success: true, content: doc });
  } catch (error: any) {
    console.error("GET /api/site-content error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch site content" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const updated = await SiteContentModel.findOneAndUpdate(
      { key: "default" },
      {
        $set: {
          key: "default",
          ...body,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json({ success: true, content: updated });
  } catch (error: any) {
    console.error("POST /api/site-content error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save site content" },
      { status: 500 }
    );
  }
}
