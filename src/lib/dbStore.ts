import { connectToDatabase } from './mongodb';
import { ProductModel, OrderModel, InquiryModel, NewsletterModel, ReviewModel } from './models';
import { INITIAL_PRODUCTS } from '@/data/initialData';
import { Product, Order, Inquiry, Review } from '@/types';

// In-memory persistent state for development or zero-config fallback
let memoryProducts: Product[] = [...INITIAL_PRODUCTS];
let memoryOrders: Order[] = [
  {
    orderId: 'ORD-IRA-1092',
    customer: {
      fullName: 'Aarohi Sen',
      email: 'aarohi@example.com',
      phone: '+91 98765 43210',
    },
    shippingAddress: {
      address: '402, Royal Palms, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      country: 'India',
    },
    items: [
      {
        productId: 'ira-101',
        title: 'Floral Anarkali Dress',
        price: 2999,
        size: 'M',
        quantity: 1,
        image: '/images/cat_dress.jpg',
      }
    ],
    subtotal: 2999,
    discount: 0,
    shipping: 0,
    total: 2999,
    paymentMethod: 'UPI',
    paymentStatus: 'paid',
    orderStatus: 'Confirmed',
    createdAt: '2026-03-15T10:00:00.000Z',
  }
];
let memoryInquiries: Inquiry[] = [
  {
    name: 'Kavya Rajesh',
    email: 'kavya.rajesh@gmail.com',
    phone: '+91 99954 66002',
    subject: 'Bridal Silk Anarkali Customization',
    message: 'Hello Nikhil & Anju, do you offer custom height adjustments for the Pure Silk Anarkali? Looking forward to visiting your Guruvayoor atelier!',
    createdAt: new Date().toISOString(),
  }
];
let memoryNewsletters: Array<{ email: string; createdAt: string }> = [
  { email: 'ananya.sharma@gmail.com', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { email: 'meera.patel@gmail.com', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { email: 'sneha.nair@gmail.com', createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
];
let memoryReviews: Review[] = [
  {
    _id: 'rev-101',
    productId: 'ira-101',
    productTitle: 'Floral Anarkali Dress',
    productImage: '/images/cat_dress.jpg',
    customerName: 'Pooja Menon',
    customerEmail: 'pooja.menon@gmail.com',
    rating: 5,
    comment: 'The drape and pure silk lining are exquisite! Wore this to a family wedding in Thrissur and received countless compliments.',
    verifiedPurchase: true,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    _id: 'rev-102',
    productId: 'ira-102',
    productTitle: 'Embroidered Silk Kurti',
    productImage: '/images/cat_kurti.jpg',
    customerName: 'Divya Nambiar',
    customerEmail: 'divya.nambiar@gmail.com',
    rating: 5,
    comment: 'Exceptional zari embroidery quality. The fabric breatheability in Kerala weather is truly comfortable and regal.',
    verifiedPurchase: true,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    _id: 'rev-103',
    productId: 'ira-103',
    productTitle: 'Banarasi Heritage Saree',
    productImage: '/images/cat_saree.jpg',
    customerName: 'Ananya Sharma',
    customerEmail: 'ananya.sharma@gmail.com',
    rating: 5,
    comment: 'Pure handloom authenticity! The golden zari pallu shimmers gracefully. Highly recommend IRA Lifestyle!',
    verifiedPurchase: true,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  }
];

export async function getProducts(filter?: { category?: string; featured?: boolean }): Promise<Product[]> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      // Check if DB is empty, seed if so
      const count = await ProductModel.countDocuments();
      if (count === 0) {
        await ProductModel.insertMany(INITIAL_PRODUCTS);
      } else {
        // Sync any updated image URLs from INITIAL_PRODUCTS for initial items
        for (const initP of INITIAL_PRODUCTS) {
          await ProductModel.updateOne(
            { id: initP.id },
            { $set: { image: initP.image, gallery: initP.gallery } }
          );
        }
      }
      const query: Record<string, unknown> = {};
      if (filter?.category) query.category = filter.category;
      if (filter?.featured) query.isFeatured = true;

      const docs = await ProductModel.find(query).lean();
      return docs.map(doc => ({
        ...doc,
        id: doc.id || (doc._id as unknown as string).toString(),
        _id: (doc._id as unknown as string).toString(),
      })) as unknown as Product[];
    }
  } catch (err) {
    console.warn('MongoDB query failed, falling back to memory store:', err);
  }

  // Memory fallback
  let list = [...memoryProducts];
  if (filter?.category) {
    list = list.filter(p => p.category.toLowerCase() === filter.category?.toLowerCase());
  }
  if (filter?.featured) {
    list = list.filter(p => p.isFeatured);
  }
  return list;
}

export async function getProductByIdOrSlug(identifier: string): Promise<Product | null> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const doc = await ProductModel.findOne({
        $or: [{ id: identifier }, { slug: identifier }]
      }).lean();
      if (doc) {
        return {
          ...doc,
          id: doc.id || (doc._id as unknown as string).toString(),
          _id: (doc._id as unknown as string).toString(),
        } as unknown as Product;
      }
    }
  } catch (err) {
    console.warn('MongoDB single product lookup fallback:', err);
  }

  const p = memoryProducts.find(item => item.id === identifier || item.slug === identifier);
  return p || null;
}

export async function createProduct(productData: Partial<Product>): Promise<Product> {
  const newProduct: Product = {
    id: `ira-${Date.now()}`,
    slug: productData.slug || (productData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `prod-${Date.now()}`),
    title: productData.title || 'Untitled Luxury Garment',
    category: productData.category || 'dresses',
    categoryLabel: productData.categoryLabel || 'Dresses',
    price: Number(productData.price) || 2499,
    originalPrice: productData.originalPrice ? Number(productData.originalPrice) : undefined,
    rating: 5.0,
    reviewsCount: 1,
    image: productData.image || '/images/cat_dress.jpg',
    gallery: productData.gallery || [productData.image || '/images/cat_dress.jpg'],
    description: productData.description || 'Exclusive luxury ethnic attire crafted for timeless grace.',
    features: productData.features || ['Premium fabric', 'Handcrafted details'],
    fabric: productData.fabric || 'Pure Silk Blend',
    care: productData.care || 'Dry clean only',
    sizes: productData.sizes && productData.sizes.length ? productData.sizes : ['S', 'M', 'L', 'XL'],
    colors: productData.colors || ['Gold', 'Emerald'],
    inStock: productData.inStock !== undefined ? productData.inStock : true,
    isFeatured: !!productData.isFeatured,
    isNewArrival: !!productData.isNewArrival,
    bestseller: false,
  };

  try {
    const conn = await connectToDatabase();
    if (conn) {
      const created = await ProductModel.create(newProduct);
      return created.toObject() as unknown as Product;
    }
  } catch (err) {
    console.warn('MongoDB product create fallback:', err);
  }

  memoryProducts.unshift(newProduct);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const updated = await ProductModel.findOneAndUpdate(
        { $or: [{ id }, { slug: id }] },
        { $set: updates },
        { new: true }
      ).lean();
      if (updated) return updated as unknown as Product;
    }
  } catch (err) {
    console.warn('MongoDB product update fallback:', err);
  }

  const idx = memoryProducts.findIndex(p => p.id === id || p.slug === id);
  if (idx !== -1) {
    memoryProducts[idx] = { ...memoryProducts[idx], ...updates };
    return memoryProducts[idx];
  }
  return null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      await ProductModel.deleteOne({ $or: [{ id }, { slug: id }] });
      return true;
    }
  } catch (err) {
    console.warn('MongoDB product delete fallback:', err);
  }

  const prevLen = memoryProducts.length;
  memoryProducts = memoryProducts.filter(p => p.id !== id && p.slug !== id);
  return memoryProducts.length < prevLen;
}

export async function createOrder(orderData: Partial<Order>): Promise<Order> {
  const newOrder: Order = {
    orderId: `ORD-IRA-${Math.floor(1000 + Math.random() * 9000)}`,
    customer: orderData.customer || { fullName: 'Valued Client', email: '', phone: '' },
    shippingAddress: orderData.shippingAddress || { address: '', city: '', state: '', pincode: '', country: 'India' },
    items: orderData.items || [],
    subtotal: orderData.subtotal || 0,
    discount: orderData.discount || 0,
    shipping: orderData.shipping || 0,
    total: orderData.total || 0,
    paymentMethod: orderData.paymentMethod || 'Online UPI',
    paymentStatus: (orderData.paymentStatus as any) || 'pending',
    orderStatus: (orderData.orderStatus as any) || 'Pending',
    createdAt: new Date().toISOString(),
  };

  try {
    const conn = await connectToDatabase();
    if (conn) {
      const created = await OrderModel.create(newOrder);
      return created.toObject() as unknown as Order;
    }
  } catch (err) {
    console.warn('MongoDB order create fallback:', err);
  }

  memoryOrders.unshift(newOrder);
  return newOrder;
}

export async function getOrders(): Promise<Order[]> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const docs = await OrderModel.find().sort({ createdAt: -1 }).lean();
      return docs as unknown as Order[];
    }
  } catch (err) {
    console.warn('MongoDB getOrders fallback:', err);
  }

  return memoryOrders;
}

export async function createInquiry(inquiry: Inquiry): Promise<Inquiry> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const doc = await InquiryModel.create(inquiry);
      return doc.toObject() as unknown as Inquiry;
    }
  } catch (err) {
    console.warn('MongoDB inquiry fallback:', err);
  }
  memoryInquiries.unshift(inquiry);
  return inquiry;
}

export async function updateOrderStatus(
  orderId: string, 
  orderStatus: string, 
  paymentStatus?: string
): Promise<Order | null> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const updates: any = { orderStatus };
      if (paymentStatus) updates.paymentStatus = paymentStatus;
      const updated = await OrderModel.findOneAndUpdate(
        { orderId },
        { $set: updates },
        { new: true }
      ).lean();
      if (updated) return updated as unknown as Order;
    }
  } catch (err) {
    console.warn('MongoDB updateOrderStatus fallback:', err);
  }

  const idx = memoryOrders.findIndex(o => o.orderId === orderId);
  if (idx !== -1) {
    memoryOrders[idx].orderStatus = orderStatus as any;
    if (paymentStatus) memoryOrders[idx].paymentStatus = paymentStatus as any;
    return memoryOrders[idx];
  }
  return null;
}

export async function deleteOrder(orderId: string): Promise<boolean> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      await OrderModel.deleteOne({ orderId });
      return true;
    }
  } catch (err) {
    console.warn('MongoDB deleteOrder fallback:', err);
  }

  const prevLen = memoryOrders.length;
  memoryOrders = memoryOrders.filter(o => o.orderId !== orderId);
  return memoryOrders.length < prevLen;
}

export async function getInquiries(): Promise<Inquiry[]> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const docs = await InquiryModel.find().sort({ createdAt: -1 }).lean();
      return docs as unknown as Inquiry[];
    }
  } catch (err) {
    console.warn('MongoDB getInquiries fallback:', err);
  }
  return memoryInquiries;
}

export async function deleteInquiry(id: string): Promise<boolean> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      await InquiryModel.deleteOne({ _id: id });
      return true;
    }
  } catch (err) {
    console.warn('MongoDB deleteInquiry fallback:', err);
  }
  const prevLen = memoryInquiries.length;
  memoryInquiries = memoryInquiries.filter(inq => (inq as any)._id !== id && (inq as any).id !== id);
  return memoryInquiries.length < prevLen;
}

export async function addNewsletterSubscriber(email: string): Promise<boolean> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      await NewsletterModel.findOneAndUpdate(
        { email },
        { $setOnInsert: { email } },
        { upsert: true, new: true }
      );
      return true;
    }
  } catch (err) {
    console.warn('MongoDB addNewsletterSubscriber fallback:', err);
  }

  if (!memoryNewsletters.some(s => s.email.toLowerCase() === email.toLowerCase())) {
    memoryNewsletters.unshift({ email, createdAt: new Date().toISOString() });
  }
  return true;
}

export async function getNewsletterSubscribers(): Promise<Array<{ email: string; createdAt: string }>> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const docs = await NewsletterModel.find().sort({ createdAt: -1 }).lean();
      if (docs && docs.length > 0) {
        return docs.map(d => ({
          email: d.email,
          createdAt: (d as any).createdAt ? new Date((d as any).createdAt).toISOString() : new Date().toISOString(),
        }));
      }
    }
  } catch (err) {
    console.warn('MongoDB getNewsletterSubscribers fallback:', err);
  }
  return memoryNewsletters;
}

export async function deleteNewsletterSubscriber(email: string): Promise<boolean> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      await NewsletterModel.deleteOne({ email });
      return true;
    }
  } catch (err) {
    console.warn('MongoDB deleteNewsletterSubscriber fallback:', err);
  }
  const prevLen = memoryNewsletters.length;
  memoryNewsletters = memoryNewsletters.filter(s => s.email.toLowerCase() !== email.toLowerCase());
  return memoryNewsletters.length < prevLen;
}

export async function createReview(reviewData: Partial<Review>): Promise<Review> {
  const newRev: Review = {
    _id: `rev-${Date.now()}`,
    productId: reviewData.productId || '',
    productTitle: reviewData.productTitle || '',
    productImage: reviewData.productImage || '',
    customerName: reviewData.customerName || 'Anonymous Client',
    customerEmail: reviewData.customerEmail || '',
    rating: Number(reviewData.rating) || 5,
    comment: reviewData.comment || '',
    verifiedPurchase: true,
    status: 'approved',
    createdAt: new Date().toISOString(),
  };

  try {
    const conn = await connectToDatabase();
    if (conn) {
      const doc = await ReviewModel.create(newRev);
      const saved = doc.toObject() as unknown as Review;
      return {
        ...saved,
        _id: (doc._id as unknown as string).toString(),
      };
    }
  } catch (err) {
    console.warn('MongoDB createReview fallback:', err);
  }

  memoryReviews.unshift(newRev);
  return newRev;
}

export async function getReviews(productId?: string): Promise<Review[]> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const filter = productId ? { productId } : {};
      const docs = await ReviewModel.find(filter).sort({ createdAt: -1 }).lean();
      if (docs && docs.length > 0) {
        return docs.map(d => ({
          ...d,
          _id: (d._id as unknown as string).toString(),
        })) as unknown as Review[];
      }
    }
  } catch (err) {
    console.warn('MongoDB getReviews fallback:', err);
  }

  if (productId) {
    return memoryReviews.filter(r => r.productId === productId);
  }
  return memoryReviews;
}

export async function deleteReview(id: string): Promise<boolean> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      await ReviewModel.deleteOne({ _id: id });
      return true;
    }
  } catch (err) {
    console.warn('MongoDB deleteReview fallback:', err);
  }

  const prevLen = memoryReviews.length;
  memoryReviews = memoryReviews.filter(r => r._id !== id && r.id !== id);
  return memoryReviews.length < prevLen;
}

export async function updateReviewStatus(id: string, status: string): Promise<boolean> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      await ReviewModel.updateOne({ _id: id }, { $set: { status } });
      return true;
    }
  } catch (err) {
    console.warn('MongoDB updateReviewStatus fallback:', err);
  }

  const r = memoryReviews.find(item => item._id === id || item.id === id);
  if (r) {
    r.status = status as any;
    return true;
  }
  return false;
}



