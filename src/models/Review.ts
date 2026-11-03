import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  id: string;
  productId?: number;
  productName?: string;
  productImage?: string;
  name: string;
  initials: string;
  rating: number;
  text: string;
  date: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    id: { type: String, required: true, unique: true },
    productId: { type: Number, index: true },
    productName: { type: String, default: "", trim: true },
    productImage: { type: String, default: "", trim: true },
    name: { type: String, required: true, trim: true },
    initials: { type: String, default: "", trim: true },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    text: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    approved: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const ReviewModel: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
