import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { SubCategoryModel } from "@/models/SubCategory";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    const query: any = {};
    if (categoryId) {
      query.categoryId = Number(categoryId);
    }

    const subcategories = await SubCategoryModel.find(query).sort({ id: 1 }).lean();
    return NextResponse.json({ success: true, subcategories });
  } catch (error: any) {
    console.error("GET /api/subcategories error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch subcategories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    let { id, name, slug, categoryId, categoryName, image, description, sizeTemplate, active } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Subcategory name is required" }, { status: 400 });
    }

    if (!categoryId) {
      return NextResponse.json({ error: "Parent category is required" }, { status: 400 });
    }

    if (!slug || !slug.trim()) {
      slug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-");
    }

    // Auto-generate numeric ID if not present
    if (!id) {
      const highest = await SubCategoryModel.findOne({}).sort({ id: -1 }).select("id").lean();
      id = (highest?.id || 0) + 1;
    }

    const subcategory = await SubCategoryModel.findOneAndUpdate(
      { id },
      {
        $set: {
          name: name.trim(),
          slug: slug.trim(),
          categoryId: Number(categoryId),
          categoryName: categoryName || "Standard",
          image: image || "",
          description: description || "",
          sizeTemplate: sizeTemplate || "S, M, L, XL",
          active: active ?? true,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();

    return NextResponse.json({ success: true, subcategory });
  } catch (error: any) {
    console.error("POST /api/subcategories error:", error);
    return NextResponse.json({ error: error.message || "Failed to save subcategory" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");

    if (!idParam) {
      return NextResponse.json({ error: "Subcategory ID is required" }, { status: 400 });
    }

    const id = Number(idParam);
    await SubCategoryModel.deleteOne({ id });

    return NextResponse.json({ success: true, message: `Subcategory deleted` });
  } catch (error: any) {
    console.error("DELETE /api/subcategories error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete subcategory" }, { status: 500 });
  }
}
