import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { UserModel } from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, error: "Please enter your email address." },
        { status: 400 },
      );
    }

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Please enter your password." },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check if matches master Admin in .env
    const adminEmail = process.env.ADMIN_EMAIL || "gandhiglaj@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Gandhiglaj@123";

    if (
      normalizedEmail === adminEmail.toLowerCase() &&
      password === adminPassword
    ) {
      return NextResponse.json({
        success: true,
        user: {
          id: "admin-master",
          email: adminEmail,
          name: "Atelier Administrator",
          role: "admin",
        },
      });
    }

    // 2. Connect to MongoDB
    await connectToDatabase();

    // 3. Find registered user
    const user = await UserModel.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "No account found with this email. Please check your spelling or register.",
        },
        { status: 401 },
      );
    }

    // 4. Compare password hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Incorrect password. Please verify and try again.",
        },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Signed in successfully!",
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name || normalizedEmail.split("@")[0],
        phone: user.phone || "",
        address: user.address || { street: "", city: "Gadhinglaj", state: "Maharashtra", pincode: "" },
        preferredSize: user.preferredSize || "M",
        role: user.role || "user",
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to sign in. Please try again.",
      },
      { status: 500 },
    );
  }
}
