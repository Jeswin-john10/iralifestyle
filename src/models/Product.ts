import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductDocument extends Document {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images: string[];
  rating: number;
  reviewsCount: number;
  description: string;
  fabric: string;
  care: string;
  sizes: string[];
  inStock: boolean;
  featured: boolean;
  isNewArrival: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    category: { type: String, required: true },
    image: { type: String, required: true },
    images: { type: [String], default: [] },
    rating: { type: Number, default: 5.0 },
    reviewsCount: { type: Number, default: 1 },
    description: { type: String, required: true },
    fabric: { type: String, default: 'Luxury Fabric' },
    care: { type: String, default: 'Dry clean only' },
    sizes: { type: [String], default: ['S', 'M', 'L', 'XL'] },
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ProductModel: Model<IProductDocument> =
  mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema);
