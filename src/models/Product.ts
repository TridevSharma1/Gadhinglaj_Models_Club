import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductSizeStock {
  size: string;
  stock: number;
}

export interface IProductColorVariant {
  id: string;
  name: string;
  stock: number;
  image?: string;
  images?: string[];
  hasSizes?: boolean;
  sizes?: string[];
  sizeStocks?: IProductSizeStock[];
}

export interface IProduct extends Document {
  id: number;
  name: string;
  sku?: string;
  barcode?: string;
  brand?: string;
  category: string;
  subcategory?: string;
  type: "readymade" | "rental";
  price: number;
  mrp: number;
  rentalPrice: number;
  deposit: number;
  rentalDuration: string;
  rating: number;
  reviews: number;
  sizes: string[];
  color: string;
  fabric: string;
  sareeLength?: string;
  offerText?: string;
  tags?: string[];
  occasion: string;
  stock: number;
  featured: boolean;
  newArrival: boolean;
  isPremium?: boolean;
  isTrending?: boolean;
  isLiveSpecial?: boolean;
  isLimitedOffer?: boolean;
  prebookingEnabled?: boolean;
  colors?: IProductColorVariant[];
  active: boolean;
  available: boolean;
  image: string;
  images?: string[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    sku: { type: String, default: "", trim: true },
    barcode: { type: String, default: "", trim: true },
    brand: { type: String, default: "Gadhinglaj Models Club Atelier" },
    category: { type: String, required: true },
    subcategory: { type: String, default: "" },
    type: { type: String, enum: ["readymade", "rental"], default: "readymade" },
    price: { type: Number, default: 0 },
    mrp: { type: Number, default: 0 },
    rentalPrice: { type: Number, default: 0 },
    deposit: { type: Number, default: 0 },
    rentalDuration: { type: String, default: "3 days (extendable)" },
    rating: { type: Number, default: 4.8 },
    reviews: { type: Number, default: 0 },
    sizes: { type: [String], default: ["S", "M", "L", "XL"] },
    color: { type: String, default: "" },
    fabric: { type: String, default: "" },
    sareeLength: { type: String, default: "" },
    offerText: { type: String, default: "" },
    tags: { type: [String], default: [] },
    occasion: { type: String, default: "" },
    stock: { type: Number, default: 1 },
    featured: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: true },
    isPremium: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isLiveSpecial: { type: Boolean, default: false },
    isLimitedOffer: { type: Boolean, default: false },
    prebookingEnabled: { type: Boolean, default: false },
    colors: [
      {
        id: { type: String },
        name: { type: String },
        stock: { type: Number, default: 0 },
        image: { type: String, default: "" },
        images: { type: [String], default: [] },
        hasSizes: { type: Boolean, default: false },
        sizes: { type: [String], default: [] },
        sizeStocks: [
          {
            size: { type: String },
            stock: { type: Number, default: 0 },
          },
        ],
      },
    ],
    active: { type: Boolean, default: true },
    available: { type: Boolean, default: true },
    image: { type: String, default: "" },
    images: { type: [String], default: [] },
    description: { type: String, default: "" },
  },
  { timestamps: true },
);

export const ProductModel: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
