import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import { OrderModel } from "@/models/Order";
import { ProductModel } from "@/models/Product";
import { sendInvoiceEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return NextResponse.json(
        { success: false, error: "Razorpay secret key is missing on the server." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Payment verification parameters missing." },
        { status: 400 }
      );
    }

    // Verify HMAC SHA256 signature
    const signaturePayload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(signaturePayload)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Payment signature verification failed. Invalid transaction." },
        { status: 400 }
      );
    }

    // Payment is genuine & verified
    await connectToDatabase();

    const orderPayload = {
      id: orderData?.id || `GMC-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: orderData?.userId || "",
      customer: orderData?.customer || "Valued Patron",
      phone: orderData?.phone || "",
      email: orderData?.email || "",
      date: orderData?.date || new Date().toISOString().slice(0, 10),
      items: orderData?.items || [],
      amount: orderData?.amount || 0,
      subtotal: orderData?.subtotal || 0,
      discount: orderData?.discount || 0,
      delivery: orderData?.delivery || 0,
      tax: orderData?.tax || 0,
      payment: "Razorpay (Online Payment)",
      paymentStatus: "Paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: "Confirmed",
      shippingAddress: orderData?.shippingAddress || {},
      notes: orderData?.notes || "",
    };

    const savedOrder = await OrderModel.findOneAndUpdate(
      { id: orderPayload.id },
      { $set: orderPayload },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send itemized luxury invoice email to customer asynchronously
    if (orderPayload.email) {
      sendInvoiceEmail({
        id: orderPayload.id,
        customer: orderPayload.customer,
        email: orderPayload.email,
        phone: orderPayload.phone,
        date: orderPayload.date,
        items: orderPayload.items,
        amount: orderPayload.amount,
        subtotal: orderPayload.subtotal,
        discount: orderPayload.discount,
        delivery: orderPayload.delivery,
        tax: orderPayload.tax,
        payment: orderPayload.payment,
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        shippingAddress: orderPayload.shippingAddress,
      }).catch((emailErr) => {
        console.warn("Could not dispatch invoice email:", emailErr);
      });
    }

    // Optionally decrement product stock if matching product exists
    if (Array.isArray(orderPayload.items)) {
      for (const item of orderPayload.items) {
        if (item.productId) {
          try {
            await ProductModel.findOneAndUpdate(
              { id: item.productId, stock: { $gte: item.qty || 1 } },
              { $inc: { stock: -(item.qty || 1) } }
            );
          } catch (stockErr) {
            console.warn("Stock decrement warning for product:", item.productId, stockErr);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      order: savedOrder,
      paymentId: razorpay_payment_id,
    });
  } catch (error: any) {
    console.error("Razorpay payment verification error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error verifying payment.",
      },
      { status: 500 }
    );
  }
}
