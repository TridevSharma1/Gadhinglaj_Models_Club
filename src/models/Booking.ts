import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBooking extends Document {
  id: string;
  customer: string;
  phone: string;
  email: string;
  outfit: string;
  size: string;
  color?: string;
  start: string;
  end: string;
  occasion: string;
  notes?: string;
  rental: number;
  deposit: number;
  status: string;
  isCustomDesign?: boolean;
  bust?: string;
  waist?: string;
  height?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    id: { type: String, required: true, unique: true },
    customer: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: "", trim: true },
    outfit: { type: String, required: true, trim: true },
    size: { type: String, default: "Free Size", trim: true },
    color: { type: String, default: "", trim: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
    occasion: { type: String, default: "Pre-Wedding Shoot" },
    notes: { type: String, default: "" },
    rental: { type: Number, required: true, default: 0 },
    deposit: { type: Number, required: true, default: 0 },
    status: { type: String, default: "Pending" },
    isCustomDesign: { type: Boolean, default: false },
    bust: { type: String, default: "" },
    waist: { type: String, default: "" },
    height: { type: String, default: "" },
  },
  { timestamps: true },
);

export const BookingModel: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
