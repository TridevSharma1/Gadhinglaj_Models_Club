import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISiteContent extends Document {
  key: string;
  businessName: string;
  owner: string;
  phone: string;
  email: string;
  address: string;
  tagline: string;
  aboutText: string;
  footerText: string;
  // Top Header Ad Ribbon
  topAdEnabled: boolean;
  topAdPrefix: string;
  topAdText: string;
  topAdLink: string;
  topAdFeature: string;
  topAdShowFeature: boolean;
  topAdPhone: string;
  topAdShowPhone: boolean;
  topAdBtnText: string;
  topAdWhatsAppMessage: string;
  topAdTheme: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteContentSchema = new Schema<ISiteContent>(
  {
    key: { type: String, default: "default", unique: true },
    businessName: { type: String, default: "Gadhinglaj Models Club" },
    owner: { type: String, default: "Priyanka Desai (Gilbile)" },
    phone: { type: String, default: "+91 96996 20950" },
    email: { type: String, default: "support.gadhinglajmodelsclub@gmail.com" },
    address: {
      type: String,
      default:
        "Shop No 1, Near Shivaji Bank, Main Road, Tilak Path, Gadhinglaj, Maharashtra 416502",
    },
    tagline: {
      type: String,
      default:
        "Premium ready-made apparel and high-end designer dress rental in Gadhinglaj.",
    },
    aboutText: { type: String, default: "" },
    footerText: { type: String, default: "" },
    // Top Header Ad Ribbon
    topAdEnabled: { type: Boolean, default: true },
    topAdPrefix: { type: String, default: "Gadhinglaj Models Club" },
    topAdText: {
      type: String,
      default:
        "Designer Boutique & Luxury Dress Rental Studio by Priyanka Desai",
    },
    topAdLink: { type: String, default: "/rental" },
    topAdFeature: { type: String, default: "Complimentary Fitting" },
    topAdShowFeature: { type: Boolean, default: true },
    topAdPhone: { type: String, default: "+91 96996 20950" },
    topAdShowPhone: { type: Boolean, default: true },
    topAdBtnText: { type: String, default: "Stylist Concierge" },
    topAdWhatsAppMessage: {
      type: String,
      default:
        "Hello Priyanka ji, I would like to inquire about outfit rental and trial fitting at Gadhinglaj Models Club.",
    },
    topAdTheme: { type: String, default: "burgundy" },
  },
  { timestamps: true }
);

export const SiteContentModel: Model<ISiteContent> =
  mongoose.models.SiteContent ||
  mongoose.model<ISiteContent>("SiteContent", SiteContentSchema);
