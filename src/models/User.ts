import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserAddress {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  address?: IUserAddress;
  preferredSize?: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IUserAddress>(
  {
    street: { type: String, default: "", trim: true },
    city: { type: String, default: "Gadhinglaj", trim: true },
    state: { type: String, default: "Maharashtra", trim: true },
    pincode: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: AddressSchema,
      default: () => ({
        street: "",
        city: "Gadhinglaj",
        state: "Maharashtra",
        pincode: "",
      }),
    },
    preferredSize: {
      type: String,
      default: "M",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);

export const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
