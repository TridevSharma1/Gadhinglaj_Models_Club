import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const envEmail = process.env.ADMIN_EMAIL || "gandhiglaj@gmail.com";
    const envPassword = process.env.ADMIN_PASSWORD || "Gandhiglaj@123";

    const defaultEmail = "admin@gadhinglajmodelsclub.com";
    const defaultPassword = "admin123";

    const isMatch =
      (email.toLowerCase() === envEmail.toLowerCase() && password === envPassword) ||
      (email.toLowerCase() === defaultEmail.toLowerCase() && password === defaultPassword);

    if (isMatch) {
      return NextResponse.json({ success: true, email: envEmail });
    } else {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
