import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { BookingModel } from "@/models/Booking";

export async function GET() {
  try {
    await connectToDatabase();
    const bookings = await BookingModel.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, bookings });
  } catch (error: any) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch bookings" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    let {
      id,
      customer,
      phone,
      email,
      outfit,
      size,
      color,
      start,
      end,
      occasion,
      notes,
      rental,
      deposit,
      status,
      isCustomDesign,
      bust,
      waist,
      height,
    } = body;

    if (!customer || !customer.trim()) {
      return NextResponse.json({ error: "Customer name is required" }, { status: 400 });
    }
    if (!phone || !phone.trim()) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }
    if (!outfit || !outfit.trim()) {
      return NextResponse.json({ error: "Outfit selection is required" }, { status: 400 });
    }

    // Auto-generate booking ID if not provided
    if (!id) {
      id = `GMC-RNT-${Math.floor(2000 + Math.random() * 7999)}`;
    }

    const booking = await BookingModel.findOneAndUpdate(
      { id },
      {
        $set: {
          customer: customer.trim(),
          phone: phone.trim(),
          email: email?.trim() || "",
          outfit: outfit.trim(),
          size: size?.trim() || "Free Size",
          color: color?.trim() || "",
          start: start || new Date().toISOString().slice(0, 10),
          end: end || new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
          occasion: occasion || "Pre-Wedding Shoot",
          notes: notes || "",
          rental: Number(rental) || 0,
          deposit: Number(deposit) || 0,
          status: status || "Pending",
          isCustomDesign: Boolean(isCustomDesign),
          bust: bust || "",
          waist: waist || "",
          height: height || "",
        },
      },
      { upsert: true, new: true },
    );

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save rental reservation" },
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
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    await BookingModel.deleteOne({ id });
    return NextResponse.json({ success: true, message: `Reservation ${id} removed` });
  } catch (error: any) {
    console.error("DELETE /api/bookings error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete booking" },
      { status: 500 },
    );
  }
}
