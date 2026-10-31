import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { UserModel } from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    await connectToDatabase();
    const user = await UserModel.findOne({ email: email.trim().toLowerCase() }).select("-password").lean();

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("GET /api/auth/profile error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, phone, address, preferredSize } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "User email is required" }, { status: 400 });
    }

    await connectToDatabase();
    const normalizedEmail = email.trim().toLowerCase();

    // Clean address object
    const updatedAddress = {
      street: address?.street?.trim() || "",
      city: address?.city?.trim() || "Gadhinglaj",
      state: address?.state?.trim() || "Maharashtra",
      pincode: address?.pincode?.trim() || "",
    };

    const user = await UserModel.findOneAndUpdate(
      { email: normalizedEmail },
      {
        $set: {
          name: name?.trim() || "",
          phone: phone?.trim() || "",
          address: updatedAddress,
          preferredSize: preferredSize || "M",
        },
      },
      { new: true },
    ).select("-password").lean();

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully!",
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        preferredSize: user.preferredSize,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("PUT /api/auth/profile error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
