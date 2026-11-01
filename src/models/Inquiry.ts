import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInquiry extends Document {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  preferredDate?: string;
  preferredTime?: string;
  message: string;
  date: string;
  status: "New" | "Contacted" | "Resolved";
  notes?: string;
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: "", trim: true },
    subject: { type: String, default: "In-Studio Fitting Consultation", trim: true },
    preferredDate: { type: String, default: "" },
    preferredTime: { type: String, default: "" },
    message: { type: String, default: "", trim: true },
    date: { type: String, required: true },
    status: {
      type: String,
      enum: ["New", "Contacted", "Resolved"],
      default: "New",
    },
    notes: { type: String, default: "" },
    source: { type: String, default: "Visit Page" },
  },
  { timestamps: true }
);

export const InquiryModel: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);
