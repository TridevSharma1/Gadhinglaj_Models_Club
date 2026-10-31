import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { CategoryModel } from "@/models/Category";
import { SubCategoryModel } from "@/models/SubCategory";
import { ProductModel } from "@/models/Product";

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await CategoryModel.find({}).sort({ id: 1 }).lean();
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    let { id, name, slug, image, blurb, description, active } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
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
      const highest = await CategoryModel.findOne({}).sort({ id: -1 }).select("id").lean();
      id = (highest?.id || 0) + 1;
    }

    const category = await CategoryModel.findOneAndUpdate(
      { id },
      {
        $set: {
          name: name.trim(),
          slug: slug.trim(),
          image: image || "",
          blurb: blurb || description || "",
          description: description || blurb || "",
          active: active ?? true,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json({ error: error.message || "Failed to save category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");

    if (!idParam) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const id = Number(idParam);
    const cat = await CategoryModel.findOne({ id }).lean();

    if (!cat) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    await CategoryModel.deleteOne({ id });
    // Also delete linked subcategories and update products if needed
    await SubCategoryModel.deleteMany({ categoryId: id });

    return NextResponse.json({ success: true, message: `Category ${cat.name} deleted` });
  } catch (error: any) {
    console.error("DELETE /api/categories error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete category" }, { status: 500 });
  }
}
