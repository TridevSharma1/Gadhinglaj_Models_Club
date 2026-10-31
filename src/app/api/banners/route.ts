import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { BannerModel } from "@/models/Banner";

const initialBanners = [
  {
    id: 1,
    title: "Wear the Moment. Own the Look.",
    subtitle: "Premium designer outfits for your most memorable celebrations & wedding vows.",
    cta: "Explore Collection",
    link: "/shop",
    image: "/assets/hero1.jpg",
    active: true,
  },
  {
    id: 2,
    title: "Luxury Looks, Made to Impress",
    subtitle: "Discover handcrafted ethnic couture, zardozi lehengas, and regal bridal drapes.",
    cta: "Shop Now",
    link: "/readymade",
    image: "/assets/hero2.jpg",
    active: true,
  },
  {
    id: 3,
    title: "Your Perfect Photoshoot Look Awaits",
    subtitle: "Premium rental outfits for pre-wedding, post-wedding, and maternity photography.",
    cta: "Explore Rentals",
    link: "/rental",
    image: "/assets/hero3.jpg",
    active: true,
  },
];

export async function GET() {
  try {
    await connectToDatabase();
    let banners = await BannerModel.find({}).sort({ id: 1 }).lean();

    // Seed default banners if database has none
    if (!banners || banners.length === 0) {
      await BannerModel.insertMany(initialBanners);
      banners = await BannerModel.find({}).sort({ id: 1 }).lean();
    }

    return NextResponse.json({ success: true, banners });
  } catch (error: any) {
    console.error("GET /api/banners error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch hero showcases" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    let { id, title, subtitle, cta, link, image, active } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Banner title is required" }, { status: 400 });
    }

    if (!id) {
      const highest = await BannerModel.findOne({}).sort({ id: -1 }).select("id").lean();
      id = (highest?.id || 0) + 1;
    }

    const banner = await BannerModel.findOneAndUpdate(
      { id },
      {
        $set: {
          title: title.trim(),
          subtitle: subtitle?.trim() || "",
          cta: cta?.trim() || "Explore Collection",
          link: link?.trim() || "/shop",
          image: image || "",
          active: active !== undefined ? Boolean(active) : true,
        },
      },
      { upsert: true, new: true },
    );

    return NextResponse.json({ success: true, banner });
  } catch (error: any) {
    console.error("POST /api/banners error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save banner" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Banner ID is required" }, { status: 400 });
    }

    await BannerModel.deleteOne({ id: Number(id) });
    return NextResponse.json({ success: true, message: `Banner #${id} deleted` });
  } catch (error: any) {
    console.error("DELETE /api/banners error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete banner" },
      { status: 500 },
    );
  }
}
