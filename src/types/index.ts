export interface Product {
  _id?: string;
  id: string;
  title: string;
  slug: string;
  category: 'dresses' | 'kurtis' | 'sarees' | 'co-ord-sets' | 'new-arrivals' | string;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  gallery?: string[];
  description: string;
  features?: string[];
  fabric?: string;
  care?: string;
  sizes: string[];
  colors?: string[];
  inStock: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  bestseller?: boolean;
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor?: string;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  tagline: string;
  itemCount?: number;
}

export interface Order {
  _id?: string;
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
  items: {
    productId: string;
    title: string;
    price: number;
    size: string;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'Pending' | 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled' | string;
  createdAt: string;
}

export interface Inquiry {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  createdAt?: string;
}

export interface Review {
  _id?: string;
  id?: string;
  productId: string;
  productTitle: string;
  productImage?: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  verifiedPurchase?: boolean;
  status?: 'approved' | 'pending';
  createdAt: string;
}

