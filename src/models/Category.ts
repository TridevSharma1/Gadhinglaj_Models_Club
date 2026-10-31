import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  id: number;
  name: string;
  slug: string;
  image: string;
  blurb?: string;
  description?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, default: "", trim: true },
    image: { type: String, default: "" },
    blurb: { type: String, default: "" },
    description: { type: String, default: "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const CategoryModel: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
