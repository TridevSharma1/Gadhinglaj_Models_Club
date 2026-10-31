import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const folder = (formData.get("folder") as string) || "gmc_atelier";

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await uploadToCloudinary(buffer, folder);
      return NextResponse.json({ success: true, url: result.url, public_id: result.public_id });
    }

    // JSON base64 body fallback
    const body = await req.json();
    const { image, folder = "gmc_atelier" } = body;

    if (!image) {
      return NextResponse.json({ error: "No image data provided" }, { status: 400 });
    }

    const result = await uploadToCloudinary(image, folder);
    return NextResponse.json({ success: true, url: result.url, public_id: result.public_id });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 },
    );
  }
}
