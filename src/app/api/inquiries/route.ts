import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { InquiryModel } from "@/models/Inquiry";
import { sendInquiryEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const q = searchParams.get("q");

    const query: any = {};
    if (status && status !== "All") {
      query.status = status;
    }

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { subject: { $regex: q, $options: "i" } },
        { id: { $regex: q, $options: "i" } },
        { message: { $regex: q, $options: "i" } },
      ];
    }

    const inquiries = await InquiryModel.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, inquiries });
  } catch (error: any) {
    console.error("GET /api/inquiries error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const {
      name,
      phone,
      email,
      subject,
      preferredDate,
      preferredTime,
      message,
      source,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Client name is required." },
        { status: 400 }
      );
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { error: "Phone number is required." },
        { status: 400 }
      );
    }

    // Auto-generate clean, readable ID: INQ-YYMM-RAND
    const now = new Date();
    const prefix = `INQ-${now.getFullYear().toString().slice(-2)}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
    const rand = Math.floor(1000 + Math.random() * 9000);
    const id = body.id || `${prefix}-${rand}`;

    const dateStr =
      body.date || now.toISOString().split("T")[0];

    const inquiry = await InquiryModel.create({
      id,
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : "",
      subject: subject || "In-Studio Fitting Consultation",
      preferredDate: preferredDate || "",
      preferredTime: preferredTime || "",
      message: message ? message.trim() : "",
      date: dateStr,
      status: "New",
      source: source || "Visit Page",
    });

    // Send notifications in the background
    sendInquiryEmail({
      id: inquiry.id,
      name: inquiry.name,
      phone: inquiry.phone,
      email: inquiry.email,
      subject: inquiry.subject,
      preferredDate: inquiry.preferredDate,
      preferredTime: inquiry.preferredTime,
      message: inquiry.message,
    }).catch((err) => console.warn("Inquiry email notice failed:", err.message));

    return NextResponse.json(
      {
        success: true,
        message: "Inquiry successfully recorded and transmitted.",
        inquiry,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/inquiries error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "Inquiry ID required" }, { status: 400 });
    }

    const updateFields: any = {};
    if (status) updateFields.status = status;
    if (typeof notes === "string") updateFields.notes = notes;

    const inquiry = await InquiryModel.findOneAndUpdate(
      { id },
      { $set: updateFields },
      { new: true }
    ).lean();

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, inquiry });
  } catch (error: any) {
    console.error("PATCH /api/inquiries error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update inquiry" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Inquiry ID required" }, { status: 400 });
    }

    const result = await InquiryModel.findOneAndDelete({ id });
    if (!result) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Inquiry deleted" });
  } catch (error: any) {
    console.error("DELETE /api/inquiries error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
