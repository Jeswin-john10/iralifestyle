export interface Product {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: 'Dresses' | 'Kurtis' | 'Sarees' | 'Co-ord Sets' | 'New Arrivals';
  image: string;
  images?: string[];
  rating: number;
  reviewsCount: number;
  description: string;
  fabric: string;
  care: string;
  sizes: string[];
  inStock: boolean;
  featured?: boolean;
  isNewArrival?: boolean;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: 'cod' | 'upi' | 'card';
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface Category {
  name: string;
  slug: string;
  image: string;
  count?: number;
}
