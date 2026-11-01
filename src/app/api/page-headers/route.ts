import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { PageHeaderModel } from "@/models/PageHeader";
import { defaultPageHeaders } from "@/data/catalog";

export async function GET() {
  try {
    await connectToDatabase();
    let headers = await PageHeaderModel.find({}).sort({ pageName: 1 }).lean();

    // Auto-seed default headers if empty in database
    if (!headers || headers.length === 0) {
      await PageHeaderModel.insertMany(defaultPageHeaders);
      headers = await PageHeaderModel.find({}).sort({ pageName: 1 }).lean();
    }

    return NextResponse.json({ success: true, headers });
  } catch (error: any) {
    console.error("GET /api/page-headers error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch page header images" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    let { pageKey, pageName, route, imageUrl, subtitle, active } = body;

    if (!pageKey || !pageKey.trim()) {
      return NextResponse.json({ error: "pageKey is required" }, { status: 400 });
    }

    const header = await PageHeaderModel.findOneAndUpdate(
      { pageKey: pageKey.trim().toLowerCase() },
      {
        $set: {
          pageKey: pageKey.trim().toLowerCase(),
          pageName: pageName?.trim() || pageKey,
          route: route?.trim() || `/${pageKey}`,
          imageUrl: imageUrl || "",
          subtitle: subtitle?.trim() || "",
          active: active !== undefined ? Boolean(active) : true,
        },
      },
      { upsert: true, new: true },
    );

    return NextResponse.json({ success: true, header });
  } catch (error: any) {
    console.error("POST /api/page-headers error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save page header banner" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const pageKey = searchParams.get("pageKey");

    if (!pageKey) {
      return NextResponse.json({ error: "pageKey is required" }, { status: 400 });
    }

    // Rather than completely removing, reset to default asset if available, or delete
    const def = defaultPageHeaders.find((d) => d.pageKey === pageKey);
    if (def) {
      await PageHeaderModel.findOneAndUpdate(
        { pageKey },
        { $set: { imageUrl: def.imageUrl, active: true } },
      );
    } else {
      await PageHeaderModel.deleteOne({ pageKey });
    }

    return NextResponse.json({
      success: true,
      message: `Page header for ${pageKey} reset to default`,
    });
  } catch (error: any) {
    console.error("DELETE /api/page-headers error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to reset page header" },
      { status: 500 },
    );
  }
}
