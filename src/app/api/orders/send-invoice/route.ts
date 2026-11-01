import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { OrderModel } from "@/models/Order";
import { sendInvoiceEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, order: directOrder } = body;

    let targetOrder = directOrder;

    if (!targetOrder && orderId) {
      await connectToDatabase();
      targetOrder = await OrderModel.findOne({ id: orderId }).lean();
    }

    if (!targetOrder) {
      return NextResponse.json(
        { success: false, error: "Order details not found." },
        { status: 404 }
      );
    }

    if (!targetOrder.email) {
      return NextResponse.json(
        { success: false, error: "This order does not have a recipient email address." },
        { status: 400 }
      );
    }

    const emailResult = await sendInvoiceEmail({
      id: targetOrder.id,
      customer: targetOrder.customer,
      email: targetOrder.email,
      phone: targetOrder.phone,
      date: targetOrder.date,
      items: targetOrder.items || [],
      amount: targetOrder.amount,
      subtotal: targetOrder.subtotal,
      discount: targetOrder.discount,
      delivery: targetOrder.delivery,
      tax: targetOrder.tax,
      payment: targetOrder.payment,
      razorpayPaymentId: targetOrder.razorpayPaymentId,
      razorpayOrderId: targetOrder.razorpayOrderId,
      shippingAddress: targetOrder.shippingAddress,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, error: emailResult.error || "Failed to dispatch email." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Invoice successfully sent to ${targetOrder.email}`,
      messageId: emailResult.messageId,
    });
  } catch (error: any) {
    console.error("Manual invoice dispatch error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send invoice email." },
      { status: 500 }
    );
  }
}
