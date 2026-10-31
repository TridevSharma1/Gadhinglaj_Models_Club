import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { UserModel } from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, confirmPassword } = body;

    // 1. Validation
    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, error: "Email is required." },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Password is required." },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 },
      );
    }

    if (!confirmPassword) {
      return NextResponse.json(
        { success: false, error: "Please confirm your password." },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: "Passwords do not match. Please re-enter." },
        { status: 400 },
      );
    }

    // 2. Connect to MongoDB
    await connectToDatabase();

    const normalizedEmail = email.trim().toLowerCase();

    // 3. Check if user already exists
    const existingUser = await UserModel.findOne({ email: normalizedEmail }).lean();
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "An account with this email address already exists. Please sign in.",
        },
        { status: 409 },
      );
    }

    // 4. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Derive a display name from email (e.g. priyanka@gmail.com -> Priyanka)
    const derivedName =
      normalizedEmail.split("@")[0].charAt(0).toUpperCase() +
      normalizedEmail.split("@")[0].slice(1);

    // 5. Create user in MongoDB Atlas
    const newUser = await UserModel.create({
      email: normalizedEmail,
      password: hashedPassword,
      name: derivedName,
      role: "user",
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully!",
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone || "",
        address: newUser.address || { street: "", city: "Gadhinglaj", state: "Maharashtra", pincode: "" },
        preferredSize: newUser.preferredSize || "M",
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create account. Please try again.",
      },
      { status: 500 },
    );
  }
}
