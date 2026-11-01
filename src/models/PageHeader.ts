import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPageHeader extends Document {
  id?: number;
  pageKey: string;
  pageName: string;
  route: string;
  imageUrl: string;
  subtitle?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PageHeaderSchema = new Schema<IPageHeader>(
  {
    id: { type: Number },
    pageKey: { type: String, required: true, unique: true, trim: true },
    pageName: { type: String, required: true, trim: true },
    route: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: "", trim: true },
    subtitle: { type: String, default: "", trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const PageHeaderModel: Model<IPageHeader> =
  mongoose.models.PageHeader || mongoose.model<IPageHeader>("PageHeader", PageHeaderSchema);
