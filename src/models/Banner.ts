import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBanner extends Document {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  image: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "", trim: true },
    cta: { type: String, default: "Explore Collection", trim: true },
    link: { type: String, default: "/shop", trim: true },
    image: { type: String, default: "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const BannerModel: Model<IBanner> =
  mongoose.models.Banner || mongoose.model<IBanner>("Banner", BannerSchema);
