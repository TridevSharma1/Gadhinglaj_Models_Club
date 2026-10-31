import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubCategory extends Document {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  categoryName: string;
  image?: string;
  description?: string;
  sizeTemplate?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubCategorySchema = new Schema<ISubCategory>(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, default: "", trim: true },
    categoryId: { type: Number, required: true },
    categoryName: { type: String, required: true },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    sizeTemplate: { type: String, default: "S, M, L, XL" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const SubCategoryModel: Model<ISubCategory> =
  mongoose.models.SubCategory || mongoose.model<ISubCategory>("SubCategory", SubCategorySchema);
