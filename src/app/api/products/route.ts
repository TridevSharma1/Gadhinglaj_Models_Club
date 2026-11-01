import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ProductModel } from "@/models/Product";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const type = searchParams.get("type");
    const q = searchParams.get("q");

    const query: any = {};
    if (category && category !== "All") query.category = category;
    if (subcategory && subcategory !== "All") query.subcategory = subcategory;
    if (type && type !== "All") query.type = type;
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { fabric: { $regex: q, $options: "i" } },
        { color: { $regex: q, $options: "i" } },
        { brand: { $regex: q, $options: "i" } },
        { tags: { $in: [new RegExp(q, "i")] } },
      ];
    }

    const products = await ProductModel.find(query).sort({ id: -1 }).lean();
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    let {
      id,
      name,
      sku,
      barcode,
      brand,
      category,
      subcategory,
      type,
      price,
      mrp,
      rentalPrice,
      deposit,
      rentalDuration,
      rating,
      reviews,
      sizes,
      color,
      fabric,
      sareeLength,
      offerText,
      tags,
      occasion,
      stock,
      featured,
      newArrival,
      isPremium,
      isTrending,
      isLiveSpecial,
      isLimitedOffer,
      prebookingEnabled,
      colors,
      active,
      available,
      image,
      images,
      description,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }

    if (!category || !category.trim()) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    // Auto-generate numeric ID if not present
    if (!id) {
      const highest = await ProductModel.findOne({}).sort({ id: -1 }).select("id").lean();
      id = (highest?.id || 0) + 1;
    }

    // Default primary image and color from color variants if present
    const colorImages = Array.isArray(colors)
      ? colors.flatMap((c: any) =>
          Array.isArray(c.images) && c.images.length > 0
            ? c.images
            : c.image
            ? [c.image]
            : []
        )
      : [];

    const finalImages = Array.isArray(images) && images.length > 0
      ? images
      : colorImages;

    if (!image) {
      image = finalImages[0] || (colors && colors.length > 0 ? colors.find((c: any) => c.image)?.image || "" : "");
    }
    if (colors && colors.length > 0 && !color) {
      color = colors[0]?.name || "Standard";
    }

    const product = await ProductModel.findOneAndUpdate(
      { id },
      {
        $set: {
          name: name.trim(),
          sku: sku || `GMC-${id + 1000}`,
          barcode: barcode || `890${id + 100000000}`,
          brand: brand || "Gadhinglaj Models Club Atelier",
          category: category.trim(),
          subcategory: subcategory || "",
          type: type || "readymade",
          price: Number(price) || 0,
          mrp: Number(mrp) || 0,
          rentalPrice: Number(rentalPrice) || 0,
          deposit: Number(deposit) || (Number(rentalPrice) || 0) * 2,
          rentalDuration: rentalDuration || "3 days (extendable)",
          rating: Number(rating) || 4.8,
          reviews: Number(reviews) || 0,
          sizes: Array.isArray(sizes) ? sizes : ["S", "M", "L", "XL"],
          color: color || "",
          fabric: fabric || "",
          sareeLength: sareeLength || "",
          offerText: offerText || "",
          tags: Array.isArray(tags) ? tags : [],
          occasion: occasion || "",
          stock: Number(stock) ?? 1,
          featured: Boolean(featured),
          newArrival: Boolean(newArrival),
          isPremium: Boolean(isPremium),
          isTrending: Boolean(isTrending),
          isLiveSpecial: Boolean(isLiveSpecial),
          isLimitedOffer: Boolean(isLimitedOffer),
          prebookingEnabled: Boolean(prebookingEnabled),
          colors: Array.isArray(colors) ? colors : [],
          active: active ?? true,
          available: available ?? true,
          image: image || "",
          images: finalImages,
          description: description || "",
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: error.message || "Failed to save product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");

    if (!idParam) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const id = Number(idParam);
    await ProductModel.deleteOne({ id });

    return NextResponse.json({ success: true, message: `Product ${id} deleted` });
  } catch (error: any) {
    console.error("DELETE /api/products error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete product" }, { status: 500 });
  }
}
