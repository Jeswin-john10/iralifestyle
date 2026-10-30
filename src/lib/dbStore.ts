import mongoose from 'mongoose';
import { connectToDatabase } from './mongodb';
import { ProductModel, OrderModel, InquiryModel, NewsletterModel, ReviewModel, CategoryModel, CustomerModel } from './models';
import { Product, Order, Inquiry, Review, Category, CustomerUser } from '@/types';

// In-memory persistent state for development or zero-config fallback
let memoryProducts: Product[] = [];
let memoryCategories: Category[] = [];
let memoryOrders: Order[] = [];
let memoryInquiries: Inquiry[] = [];
let memoryNewsletters: Array<{ email: string; createdAt: string }> = [];
let memoryReviews: Review[] = [];

export async function getProducts(filter?: { category?: string; featured?: boolean }): Promise<Product[]> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      // Build search query from database
      const query: Record<string, unknown> = {};
      if (filter?.category && filter.category !== 'all') {
        const catFilter = filter.category.trim();
        query.$or = [
          { category: { $regex: new RegExp(`^${catFilter}$`, 'i') } },
          { categoryLabel: { $regex: new RegExp(`^${catFilter}$`, 'i') } },
          { slug: { $regex: new RegExp(`^${catFilter}$`, 'i') } },
        ];
      }
      if (filter?.featured) query.isFeatured = true;

      const docs = await ProductModel.find(query).sort({ createdAt: -1 }).lean();
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
  if (filter?.category && filter.category !== 'all') {
    const cat = filter.category.toLowerCase().trim();
    list = list.filter(p => 
      p.category.toLowerCase() === cat || 
      p.categoryLabel.toLowerCase() === cat || 
      p.slug.toLowerCase() === cat
    );
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
  const baseSlug = (productData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`);
  const uniqueSuffix = Date.now().toString().slice(-4);
  const safeSlug = productData.slug ? productData.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `${baseSlug}-${uniqueSuffix}`;

  const defaultImg = productData.image || '/images/cat_dress.jpg';
  const newProduct: Product = {
    id: productData.id || `ira-${Date.now()}`,
    slug: safeSlug,
    title: productData.title || 'Untitled Luxury Garment',
    category: productData.category || 'dresses',
    categoryLabel: productData.categoryLabel || 'Dresses',
    price: Number(productData.price) || 2499,
    originalPrice: productData.originalPrice ? Number(productData.originalPrice) : undefined,
    rating: productData.rating || 5,
    reviewsCount: productData.reviewsCount || 0,
    image: defaultImg,
    gallery: productData.gallery && productData.gallery.length > 0 ? productData.gallery : [defaultImg],
    description: productData.description || 'Exclusive luxury ethnic attire crafted for timeless grace.',
    features: productData.features || ['Premium fabric', 'Handcrafted details'],
    fabric: productData.fabric || 'Pure Silk Blend',
    care: productData.care || 'Dry clean only',
    sizes: productData.sizes && productData.sizes.length ? productData.sizes : ['S', 'M', 'L', 'XL'],
    colors: productData.colors && productData.colors.length ? productData.colors : ['Gold', 'Emerald'],
    inStock: productData.inStock !== undefined ? productData.inStock : true,
    isFeatured: !!productData.isFeatured,
    isNewArrival: productData.isNewArrival !== undefined ? !!productData.isNewArrival : true,
    bestseller: !!productData.bestseller,
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

export async function getOrders(filter?: { email?: string; orderId?: string }): Promise<Order[]> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const query: Record<string, unknown> = {};
      if (filter?.email) {
        query['customer.email'] = { $regex: new RegExp(`^${filter.email.trim()}$`, 'i') };
      }
      if (filter?.orderId) {
        query.orderId = filter.orderId.trim();
      }
      const docs = await OrderModel.find(query).sort({ createdAt: -1 }).lean();
      return docs as unknown as Order[];
    }
  } catch (err) {
    console.warn('MongoDB getOrders fallback:', err);
  }

  let list = [...memoryOrders];
  if (filter?.email) {
    list = list.filter(o => o.customer?.email?.toLowerCase() === filter.email!.toLowerCase());
  }
  if (filter?.orderId) {
    list = list.filter(o => o.orderId === filter.orderId);
  }
  return list;
}

export async function createInquiry(inquiry: Inquiry): Promise<Inquiry> {
  const cleanInquiry: Inquiry = {
    name: inquiry.name?.trim() || '',
    email: inquiry.email?.trim().toLowerCase() || '',
    phone: inquiry.phone?.trim() || '',
    subject: inquiry.subject?.trim() || 'General Inquiry',
    message: inquiry.message?.trim() || '',
    createdAt: inquiry.createdAt || new Date().toISOString(),
  };

  try {
    const conn = await connectToDatabase();
    if (conn) {
      const doc = await InquiryModel.create(cleanInquiry);
      return doc.toObject() as unknown as Inquiry;
    }
  } catch (err) {
    console.warn('MongoDB inquiry fallback:', err);
  }
  memoryInquiries.unshift(cleanInquiry);
  return cleanInquiry;
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
  const cleanEmail = email.trim().toLowerCase();
  try {
    const conn = await connectToDatabase();
    if (conn) {
      await NewsletterModel.findOneAndUpdate(
        { email: cleanEmail },
        { $set: { email: cleanEmail, createdAt: new Date() } },
        { upsert: true, new: true }
      );
      return true;
    }
  } catch (err) {
    console.warn('MongoDB addNewsletterSubscriber fallback:', err);
  }

  if (!memoryNewsletters.some(s => s.email.toLowerCase() === cleanEmail)) {
    memoryNewsletters.unshift({ email: cleanEmail, createdAt: new Date().toISOString() });
  }
  return true;
}

export async function getNewsletterSubscribers(): Promise<Array<{ email: string; createdAt: string }>> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const docs = await NewsletterModel.find().sort({ createdAt: -1 }).lean();
      return docs.map(d => ({
        email: d.email,
        createdAt: (d as any).createdAt ? new Date((d as any).createdAt).toISOString() : new Date().toISOString(),
      }));
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

export async function syncProductRatingAndReviews(productId: string): Promise<void> {
  if (!productId) return;
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const prod = await ProductModel.findOne({
        $or: [{ id: productId }, { slug: productId }]
      }).lean();

      const ids: string[] = [productId, prod?.id, prod?.slug].filter((x): x is string => Boolean(x));

      const approvedRevs = await ReviewModel.find({
        productId: { $in: ids },
        $or: [{ status: 'approved' }, { status: { $exists: false } }]
      }).lean();

      const revList = approvedRevs as unknown as Review[];
      const count = revList.length;
      const avg = count > 0 
        ? Math.round((revList.reduce((acc: number, r: Review) => acc + (Number(r.rating) || 0), 0) / count) * 10) / 10 
        : 0;

      await ProductModel.updateMany(
        { $or: [{ id: productId }, { slug: productId }, ...(prod ? [{ _id: prod._id }] : [])] },
        { $set: { rating: avg, reviewsCount: count } }
      );
    }
  } catch (err) {
    console.warn('MongoDB syncProductRatingAndReviews error:', err);
  }

  // Also sync memory store
  const prod = memoryProducts.find(p => p.id === productId || p.slug === productId);
  const ids = prod ? [productId, prod.id, prod.slug].filter(Boolean) : [productId];
  const memRevs = memoryReviews.filter(r => ids.includes(r.productId) && (r.status === 'approved' || !r.status));
  const memCount = memRevs.length;
  const memAvg = memCount > 0 
    ? Math.round((memRevs.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / memCount) * 10) / 10 
    : 0;
  if (prod) {
    prod.rating = memAvg;
    prod.reviewsCount = memCount;
  }
}

export async function createReview(reviewData: Partial<Review>): Promise<Review> {
  let productId = reviewData.productId || '';
  let productTitle = reviewData.productTitle || '';
  let productImage = reviewData.productImage || '';

  // Look up product to resolve canonical id, title, and image
  try {
    const conn = await connectToDatabase();
    if (conn && productId) {
      const prod = await ProductModel.findOne({
        $or: [
          ...(mongoose.Types.ObjectId.isValid(productId) ? [{ _id: new mongoose.Types.ObjectId(productId) }] : []),
          { id: productId },
          { slug: productId }
        ]
      }).lean();
      if (prod) {
        productId = prod.id || productId;
        productTitle = productTitle || prod.title;
        productImage = productImage || prod.image;
      }
    }
  } catch (err) {
    console.warn('MongoDB createReview product lookup fallback:', err);
  }

  const reviewPayload = {
    productId,
    productTitle: productTitle || 'IRA Royal Garment',
    productImage: productImage || '',
    customerName: reviewData.customerName?.trim() || 'Anonymous Client',
    customerEmail: reviewData.customerEmail?.trim() || 'client@iralifestyle.com',
    rating: Math.min(5, Math.max(1, Number(reviewData.rating) || 5)),
    comment: reviewData.comment?.trim() || '',
    verifiedPurchase: reviewData.verifiedPurchase !== false,
    status: reviewData.status || 'approved',
  };

  try {
    const conn = await connectToDatabase();
    if (conn) {
      // NOTE: Do not pass custom string _id so Mongoose automatically creates valid ObjectId
      const doc = await ReviewModel.create(reviewPayload);
      const strId = doc._id.toString();
      await syncProductRatingAndReviews(productId);
      return {
        _id: strId,
        id: strId,
        productId: doc.productId,
        productTitle: doc.productTitle,
        productImage: doc.productImage,
        customerName: doc.customerName,
        customerEmail: doc.customerEmail,
        rating: doc.rating,
        comment: doc.comment,
        verifiedPurchase: doc.verifiedPurchase,
        status: (doc.status as any) || 'approved',
        createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
      };
    }
  } catch (err) {
    console.warn('MongoDB createReview fallback:', err);
  }

  const fallbackRev: Review = {
    _id: `rev-${Date.now()}`,
    id: `rev-${Date.now()}`,
    ...reviewPayload,
    createdAt: new Date().toISOString(),
  };
  memoryReviews.unshift(fallbackRev);
  await syncProductRatingAndReviews(productId);
  return fallbackRev;
}

export async function getReviews(productId?: string): Promise<Review[]> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      // Clean up any legacy dummy reviews safely via native collection or email/name
      try {
        await ReviewModel.collection.deleteMany({
          $or: [
            { customerEmail: { $in: ['pooja.menon@gmail.com', 'naveen.nambiar@gmail.com', 'divya.krishnan@gmail.com', 'dummy@example.com'] } },
            { customerName: { $in: ['Pooja Menon', 'Naveen Nambiar', 'Divya Krishnan', 'Dummy Reviewer'] } }
          ]
        });
      } catch {
        // ignore
      }

      let filter: Record<string, unknown> = {};
      if (productId && productId !== 'all') {
        const prod = await ProductModel.findOne({
          $or: [
            ...(mongoose.Types.ObjectId.isValid(productId) ? [{ _id: new mongoose.Types.ObjectId(productId) }] : []),
            { id: productId },
            { slug: productId }
          ]
        }).lean();

        if (prod) {
          const ids: string[] = [productId, prod.id, prod.slug, (prod._id as any)?.toString()].filter((x): x is string => Boolean(x));
          filter = { productId: { $in: ids } };
        } else {
          filter = { productId };
        }
      }

      const docs = await ReviewModel.find(filter).sort({ createdAt: -1 }).lean();
      return docs.map(d => ({
        ...d,
        _id: (d._id as unknown as string).toString(),
        id: (d._id as unknown as string).toString(),
        createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : new Date().toISOString(),
      })) as unknown as Review[];
    }
  } catch (err) {
    console.warn('MongoDB getReviews fallback:', err);
  }

  if (productId && productId !== 'all') {
    const prod = memoryProducts.find(p => p.id === productId || p.slug === productId);
    const ids = prod ? [productId, prod.id, prod.slug].filter(Boolean) : [productId];
    return memoryReviews.filter(r => ids.includes(r.productId));
  }
  return memoryReviews;
}

export async function deleteReview(id: string): Promise<boolean> {
  let productId: string | undefined;
  try {
    const conn = await connectToDatabase();
    if (conn) {
      let existing: any = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        existing = await ReviewModel.findById(id).lean();
      }
      if (!existing) {
        existing = await ReviewModel.findOne({ $or: [{ _id: id }, { id: id }] }).lean();
      }
      if (existing) {
        productId = existing.productId;
      }

      const filter = mongoose.Types.ObjectId.isValid(id)
        ? { _id: new mongoose.Types.ObjectId(id) }
        : { $or: [{ _id: id }, { id: id }] };

      const res = await ReviewModel.deleteOne(filter);
      if (productId) {
        await syncProductRatingAndReviews(productId);
      }
      return (res.deletedCount || 0) > 0;
    }
  } catch (err) {
    console.warn('MongoDB deleteReview fallback:', err);
  }

  const prevLen = memoryReviews.length;
  const target = memoryReviews.find(r => r._id === id || r.id === id);
  if (target) {
    productId = target.productId;
  }
  memoryReviews = memoryReviews.filter(r => r._id !== id && r.id !== id);
  if (productId) {
    await syncProductRatingAndReviews(productId);
  }
  return memoryReviews.length < prevLen;
}

export async function updateReviewStatus(id: string, status: string): Promise<boolean> {
  let productId: string | undefined;
  try {
    const conn = await connectToDatabase();
    if (conn) {
      let existing: any = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        existing = await ReviewModel.findById(id).lean();
      }
      if (!existing) {
        existing = await ReviewModel.findOne({ $or: [{ _id: id }, { id: id }] }).lean();
      }
      if (existing) {
        productId = existing.productId;
      }

      const filter = mongoose.Types.ObjectId.isValid(id)
        ? { _id: new mongoose.Types.ObjectId(id) }
        : { $or: [{ _id: id }, { id: id }] };

      await ReviewModel.updateOne(filter, { $set: { status } });
      if (productId) {
        await syncProductRatingAndReviews(productId);
      }
      return true;
    }
  } catch (err) {
    console.warn('MongoDB updateReviewStatus fallback:', err);
  }

  const r = memoryReviews.find(item => item._id === id || item.id === id);
  if (r) {
    r.status = status as any;
    if (r.productId) {
      await syncProductRatingAndReviews(r.productId);
    }
    return true;
  }
  return false;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const docs = await CategoryModel.find().sort({ name: 1 }).lean();
      return docs.map(doc => ({
        id: doc.id || (doc._id as unknown as string).toString(),
        name: doc.name,
        slug: doc.slug,
        image: doc.image || '',
        tagline: doc.tagline || '',
        itemCount: doc.itemCount || 0,
      }));
    }
  } catch (err) {
    console.warn('MongoDB getCategories fallback:', err);
  }
  return memoryCategories;
}

export async function createCategory(catData: Partial<Category>): Promise<Category> {
  const name = catData.name?.trim() || 'New Category';
  const slug = catData.slug?.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const newCat: Category = {
    id: catData.id || `cat-${Date.now()}`,
    name,
    slug,
    image: catData.image || '',
    tagline: catData.tagline || 'Exquisite traditional handcrafted wear',
    itemCount: Number(catData.itemCount) || 0,
  };

  try {
    const conn = await connectToDatabase();
    if (conn) {
      await CategoryModel.create(newCat);
      return newCat;
    }
  } catch (err) {
    console.warn('MongoDB createCategory fallback:', err);
  }

  memoryCategories.push(newCat);
  return newCat;
}

export async function updateCategory(idOrSlug: string, updates: Partial<Category>): Promise<Category | null> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const updated = await CategoryModel.findOneAndUpdate(
        { $or: [{ id: idOrSlug }, { slug: idOrSlug }] },
        { $set: updates },
        { new: true }
      ).lean();
      if (updated) {
        return {
          id: updated.id || (updated._id as unknown as string).toString(),
          name: updated.name,
          slug: updated.slug,
          image: updated.image,
          tagline: updated.tagline,
          itemCount: updated.itemCount,
        };
      }
    }
  } catch (err) {
    console.warn('MongoDB updateCategory fallback:', err);
  }

  const idx = memoryCategories.findIndex(c => c.id === idOrSlug || c.slug === idOrSlug);
  if (idx !== -1) {
    memoryCategories[idx] = { ...memoryCategories[idx], ...updates };
    return memoryCategories[idx];
  }
  return null;
}

export async function deleteCategory(idOrSlug: string): Promise<boolean> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      await CategoryModel.deleteOne({ $or: [{ id: idOrSlug }, { slug: idOrSlug }] });
      return true;
    }
  } catch (err) {
    console.warn('MongoDB deleteCategory fallback:', err);
  }

  const prevLen = memoryCategories.length;
  memoryCategories = memoryCategories.filter(c => c.id !== idOrSlug && c.slug !== idOrSlug);
  return memoryCategories.length < prevLen;
}

// Memory fallback store for customers
let memoryCustomers: CustomerUser[] = [];

export async function findOrCreateGoogleCustomer(profile: {
  googleId: string;
  name: string;
  email: string;
  avatar?: string;
}): Promise<CustomerUser> {
  const normalizedEmail = profile.email.toLowerCase().trim();

  try {
    const conn = await connectToDatabase();
    if (conn) {
      let customer = await CustomerModel.findOne({
        $or: [{ googleId: profile.googleId }, { email: normalizedEmail }],
      });

      if (customer) {
        // Update user profile info on login
        customer.googleId = profile.googleId;
        if (profile.name) customer.name = profile.name;
        if (profile.avatar) customer.avatar = profile.avatar;
        customer.lastLoginAt = new Date();
        await customer.save();
      } else {
        customer = await CustomerModel.create({
          googleId: profile.googleId,
          name: profile.name || 'Valued Client',
          email: normalizedEmail,
          avatar: profile.avatar || '',
          provider: 'google',
          lastLoginAt: new Date(),
        });
      }

      return {
        id: customer._id.toString(),
        googleId: customer.googleId,
        name: customer.name,
        email: customer.email,
        avatar: customer.avatar,
        provider: 'google',
        phone: customer.phone || '',
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || 'Kerala',
        pincode: customer.pincode || '',
        wishlist: (customer.wishlist as string[]) || [],
        joinedAt: customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : undefined,
      };
    }
  } catch (err) {
    console.warn('MongoDB findOrCreateGoogleCustomer fallback:', err);
  }

  // Memory fallback
  let existing = memoryCustomers.find(
    (c) => c.googleId === profile.googleId || c.email.toLowerCase() === normalizedEmail
  );
  if (existing) {
    existing.name = profile.name || existing.name;
    existing.avatar = profile.avatar || existing.avatar;
    existing.googleId = profile.googleId;
    return existing;
  }

  const newCustomer: CustomerUser = {
    id: `cust-${Date.now()}`,
    googleId: profile.googleId,
    name: profile.name || 'Valued Client',
    email: normalizedEmail,
    avatar: profile.avatar || '',
    provider: 'google',
    phone: '',
    address: '',
    city: '',
    state: 'Kerala',
    pincode: '',
    wishlist: [],
    joinedAt: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
  };
  memoryCustomers.push(newCustomer);
  return newCustomer;
}

export async function getCustomerById(id: string): Promise<CustomerUser | null> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const customer = await CustomerModel.findById(id).lean();
      if (customer) {
        return {
          id: customer._id.toString(),
          googleId: customer.googleId,
          name: customer.name,
          email: customer.email,
          avatar: customer.avatar,
          provider: customer.provider || 'google',
          phone: customer.phone || '',
          address: customer.address || '',
          city: customer.city || '',
          state: customer.state || 'Kerala',
          pincode: customer.pincode || '',
          wishlist: (customer.wishlist as string[]) || [],
          joinedAt: customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : undefined,
        };
      }
    }
  } catch (err) {
    console.warn('MongoDB getCustomerById fallback:', err);
  }

  return memoryCustomers.find((c) => c.id === id) || null;
}

export async function updateCustomerProfile(id: string, updates: Partial<CustomerUser>): Promise<CustomerUser | null> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const customer = await CustomerModel.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true }
      ).lean();

      if (customer) {
        return {
          id: customer._id.toString(),
          googleId: customer.googleId,
          name: customer.name,
          email: customer.email,
          avatar: customer.avatar,
          provider: customer.provider || 'google',
          phone: customer.phone || '',
          address: customer.address || '',
          city: customer.city || '',
          state: customer.state || 'Kerala',
          pincode: customer.pincode || '',
          wishlist: (customer.wishlist as string[]) || [],
          joinedAt: customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : undefined,
        };
      }
    }
  } catch (err) {
    console.warn('MongoDB updateCustomerProfile fallback:', err);
  }

  const idx = memoryCustomers.findIndex((c) => c.id === id);
  if (idx !== -1) {
    memoryCustomers[idx] = { ...memoryCustomers[idx], ...updates };
    return memoryCustomers[idx];
  }
  return null;
}

// --------------------------------------------------------------------------
// Real-Time Customer Wishlist (DB Persistent Login-Wise)
// --------------------------------------------------------------------------

export async function getCustomerWishlist(userIdOrEmail: string): Promise<Product[]> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const isMongoId = mongoose.isValidObjectId(userIdOrEmail);
      const query = isMongoId
        ? { $or: [{ _id: userIdOrEmail }, { email: userIdOrEmail.toLowerCase().trim() }] }
        : { email: userIdOrEmail.toLowerCase().trim() };

      const customer = await CustomerModel.findOne(query).lean();
      const wishlistIds: string[] = (customer?.wishlist as string[]) || [];

      if (!wishlistIds || wishlistIds.length === 0) {
        return [];
      }

      const allProducts = await getProducts();
      return allProducts.filter(p => wishlistIds.includes(p.id) || (p._id && wishlistIds.includes(p._id)));
    }
  } catch (err) {
    console.warn('MongoDB getCustomerWishlist fallback:', err);
  }

  const clean = userIdOrEmail.toLowerCase().trim();
  const cust = memoryCustomers.find(c => c.id === userIdOrEmail || c.email.toLowerCase() === clean);
  const wIds = cust?.wishlist || [];
  return memoryProducts.filter(p => wIds.includes(p.id));
}

export async function toggleCustomerWishlist(
  userIdOrEmail: string,
  productId: string
): Promise<{ inWishlist: boolean; wishlistIds: string[]; wishlist: Product[] }> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const isMongoId = mongoose.isValidObjectId(userIdOrEmail);
      const query = isMongoId
        ? { $or: [{ _id: userIdOrEmail }, { email: userIdOrEmail.toLowerCase().trim() }] }
        : { email: userIdOrEmail.toLowerCase().trim() };

      const customer = await CustomerModel.findOne(query);
      if (customer) {
        const currentList: string[] = (customer.wishlist as string[]) || [];
        const exists = currentList.includes(productId);
        let updatedList: string[];

        if (exists) {
          updatedList = currentList.filter(id => id !== productId);
        } else {
          updatedList = [...currentList, productId];
        }

        customer.wishlist = updatedList;
        await customer.save();

        const allProducts = await getProducts();
        const wishlistProducts = allProducts.filter(p => updatedList.includes(p.id) || (p._id && updatedList.includes(p._id)));

        return {
          inWishlist: !exists,
          wishlistIds: updatedList,
          wishlist: wishlistProducts,
        };
      }
    }
  } catch (err) {
    console.warn('MongoDB toggleCustomerWishlist fallback:', err);
  }

  // Memory fallback
  const clean = userIdOrEmail.toLowerCase().trim();
  let cust = memoryCustomers.find(c => c.id === userIdOrEmail || c.email.toLowerCase() === clean);
  if (!cust) {
    cust = {
      id: userIdOrEmail,
      email: userIdOrEmail,
      name: 'Client',
      provider: 'google',
      wishlist: [],
    };
    memoryCustomers.push(cust);
  }

  const cur = cust.wishlist || [];
  const exists = cur.includes(productId);
  const next = exists ? cur.filter(id => id !== productId) : [...cur, productId];
  cust.wishlist = next;

  const wishlistProducts = memoryProducts.filter(p => next.includes(p.id));
  return {
    inWishlist: !exists,
    wishlistIds: next,
    wishlist: wishlistProducts,
  };
}

export async function syncCustomerWishlist(
  userIdOrEmail: string,
  productIds: string[]
): Promise<Product[]> {
  if (!productIds || !productIds.length) {
    return getCustomerWishlist(userIdOrEmail);
  }

  try {
    const conn = await connectToDatabase();
    if (conn) {
      const isMongoId = mongoose.isValidObjectId(userIdOrEmail);
      const query = isMongoId
        ? { $or: [{ _id: userIdOrEmail }, { email: userIdOrEmail.toLowerCase().trim() }] }
        : { email: userIdOrEmail.toLowerCase().trim() };

      const customer = await CustomerModel.findOne(query);
      if (customer) {
        const current: string[] = (customer.wishlist as string[]) || [];
        const merged = Array.from(new Set([...current, ...productIds]));
        customer.wishlist = merged;
        await customer.save();

        const allProducts = await getProducts();
        return allProducts.filter(p => merged.includes(p.id) || (p._id && merged.includes(p._id)));
      }
    }
  } catch (err) {
    console.warn('MongoDB syncCustomerWishlist fallback:', err);
  }

  const clean = userIdOrEmail.toLowerCase().trim();
  const cust = memoryCustomers.find(c => c.id === userIdOrEmail || c.email.toLowerCase() === clean);
  if (cust) {
    const merged = Array.from(new Set([...(cust.wishlist || []), ...productIds]));
    cust.wishlist = merged;
    return memoryProducts.filter(p => merged.includes(p.id));
  }

  return [];
}
