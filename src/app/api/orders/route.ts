import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { OrderModel } from "@/models/Order";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");

    const query: any = {};
    if (userId) query.userId = userId;
    else if (email) query.email = email.toLowerCase().trim();

    const orders = await OrderModel.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("Orders fetch error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch orders." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body || !body.id) {
      return NextResponse.json(
        { success: false, error: "Order ID and data are required." },
        { status: 400 }
      );
    }

    const order = await OrderModel.findOneAndUpdate(
      { id: body.id },
      { $set: body },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Order save error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to save order." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Order ID is required for deletion." },
        { status: 400 }
      );
    }

    const res = await OrderModel.findOneAndDelete({ id });
    if (!res) {
      return NextResponse.json(
        { success: false, error: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Order removed successfully." });
  } catch (error: any) {
    console.error("Order delete error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete order." },
      { status: 500 }
    );
  }
}
