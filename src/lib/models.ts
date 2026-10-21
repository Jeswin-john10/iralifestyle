import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductDoc extends Document {
  id: string;
  title: string;
  slug: string;
  category: string;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  gallery: string[];
  description: string;
  features: string[];
  fabric?: string;
  care?: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  bestseller: boolean;
  createdAt: Date;
}

const ProductSchema = new Schema<IProductDoc>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  categoryLabel: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  rating: { type: Number, default: 5 },
  reviewsCount: { type: Number, default: 0 },
  image: { type: String, required: true },
  gallery: [{ type: String }],
  description: { type: String, required: true },
  features: [{ type: String }],
  fabric: { type: String },
  care: { type: String },
  sizes: [{ type: String }],
  colors: [{ type: String }],
  inStock: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  bestseller: { type: Boolean, default: false },
}, { timestamps: true });

export interface IOrderDoc extends Document {
  orderId: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items: Array<{
    productId: string;
    title: string;
    price: number;
    size: string;
    quantity: number;
    image: string;
  }>;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrderDoc>({
  orderId: { type: String, required: true, unique: true },
  customer: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
  },
  items: [
    {
      productId: { type: String, required: true },
      title: { type: String, required: true },
      price: { type: Number, required: true },
      size: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String },
    }
  ],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentMethod: { type: String, default: 'COD' },
  paymentStatus: { type: String, default: 'pending' },
  orderStatus: { type: String, default: 'Pending' },
}, { timestamps: true });

export interface IInquiryDoc extends Document {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  createdAt: Date;
}

const InquirySchema = new Schema<IInquiryDoc>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String },
  message: { type: String, required: true },
}, { timestamps: true });

export interface INewsletterDoc extends Document {
  email: string;
  createdAt: Date;
}

const NewsletterSchema = new Schema<INewsletterDoc>({
  email: { type: String, required: true, unique: true },
}, { timestamps: true });

export const ProductModel: Model<IProductDoc> =
  mongoose.models.Product || mongoose.model<IProductDoc>('Product', ProductSchema);

export const OrderModel: Model<IOrderDoc> =
  mongoose.models.Order || mongoose.model<IOrderDoc>('Order', OrderSchema);

export const InquiryModel: Model<IInquiryDoc> =
  mongoose.models.Inquiry || mongoose.model<IInquiryDoc>('Inquiry', InquirySchema);

export const NewsletterModel: Model<INewsletterDoc> =
  mongoose.models.Newsletter || mongoose.model<INewsletterDoc>('Newsletter', NewsletterSchema);

export interface IReviewDoc extends Document {
  productId: string;
  productTitle: string;
  productImage?: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  status: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReviewDoc>({
  productId: { type: String, required: true },
  productTitle: { type: String, required: true },
  productImage: { type: String },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  verifiedPurchase: { type: Boolean, default: true },
  status: { type: String, default: 'approved' },
}, { timestamps: true });

export const ReviewModel: Model<IReviewDoc> =
  mongoose.models.Review || mongoose.model<IReviewDoc>('Review', ReviewSchema);

export interface ICategoryDoc extends Document {
  id: string;
  name: string;
  slug: string;
  image: string;
  tagline: string;
  itemCount: number;
  createdAt: Date;
}

const CategorySchema = new Schema<ICategoryDoc>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, default: '/images/hero_set_saree.jpg' },
  tagline: { type: String, default: '' },
  itemCount: { type: Number, default: 0 },
}, { timestamps: true });

export const CategoryModel: Model<ICategoryDoc> =
  mongoose.models.Category || mongoose.model<ICategoryDoc>('Category', CategorySchema);

