import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  productId?: number;
  name: string;
  qty: number;
  size: string;
  color?: string;
  price: number;
  image?: string;
}

export interface IOrderAddress {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface IOrder extends Document {
  id: string;
  userId?: string;
  customer: string;
  phone: string;
  email: string;
  date: string;
  items: IOrderItem[];
  amount: number;
  subtotal?: number;
  discount?: number;
  delivery?: number;
  tax?: number;
  payment: string;
  paymentStatus: "Pending" | "Paid" | "Failed";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  shippingAddress?: IOrderAddress;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Number },
    name: { type: String, required: true },
    qty: { type: Number, required: true, default: 1 },
    size: { type: String, default: "Free Size" },
    color: { type: String, default: "" },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
  },
  { _id: false },
);

const OrderAddressSchema = new Schema<IOrderAddress>(
  {
    street: { type: String, default: "" },
    city: { type: String, default: "Gadhinglaj" },
    state: { type: String, default: "Maharashtra" },
    pincode: { type: String, default: "" },
  },
  { _id: false },
);

const OrderSchema = new Schema<IOrder>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, default: "" },
    customer: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: "", trim: true },
    date: { type: String, required: true },
    items: { type: [OrderItemSchema], default: [] },
    amount: { type: Number, required: true },
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    delivery: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    payment: { type: String, default: "Razorpay" },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
    razorpaySignature: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Confirmed",
    },
    shippingAddress: { type: OrderAddressSchema, default: () => ({}) },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

export const OrderModel: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
