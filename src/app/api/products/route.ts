import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ProductModel } from '@/models/Product';
import { initialProducts } from '@/lib/data';

// In-memory store for development when MongoDB is not connected
let memoryProducts = [...initialProducts];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const isNew = searchParams.get('new');
    const search = searchParams.get('search');

    const db = await connectToDatabase();

    if (db) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query: any = {};
      if (category && category !== 'all') {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }
      if (featured === 'true') {
        query.featured = true;
      }
      if (isNew === 'true') {
        query.isNewArrival = true;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
        ];
      }

      let products = await ProductModel.find(query).sort({ createdAt: -1 }).lean();

      // If DB has no products yet, seed with initialProducts
      if (products.length === 0 && Object.keys(query).length === 0) {
        await ProductModel.insertMany(initialProducts);
        products = await ProductModel.find(query).sort({ createdAt: -1 }).lean();
      }

      return NextResponse.json({
        success: true,
        source: 'mongodb',
        products: products.map((p) => ({
          ...p,
          id: p._id?.toString() || p.id,
        })),
      });
    }

    // Fallback in-memory
    let filtered = [...memoryProducts];
    if (category && category !== 'all') {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }
    if (featured === 'true') {
      filtered = filtered.filter((p) => p.featured);
    }
    if (isNew === 'true') {
      filtered = filtered.filter((p) => p.isNewArrival);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      source: 'memory',
      products: filtered,
    });
  } catch (error) {
    console.error('Products API GET Error:', error);
    return NextResponse.json({ success: false, products: initialProducts }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, originalPrice, category, image, description, fabric, care, sizes, featured, isNewArrival } = body;

    if (!name || !price || !category || !image) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

    const newProduct = {
      id: `ira-${Date.now().toString().slice(-6)}`,
      name,
      slug,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category,
      image,
      images: [image],
      rating: 5.0,
      reviewsCount: 1,
      description: description || 'Handcrafted luxury piece by IRA Lifestyle.',
      fabric: fabric || 'Pure Silk',
      care: care || 'Dry clean only',
      sizes: sizes && sizes.length > 0 ? sizes : ['S', 'M', 'L', 'XL'],
      inStock: true,
      featured: Boolean(featured),
      isNewArrival: Boolean(isNewArrival),
    };

    const db = await connectToDatabase();
    if (db) {
      const created = await ProductModel.create(newProduct);
      return NextResponse.json({
        success: true,
        source: 'mongodb',
        product: { ...created.toObject(), id: created._id.toString() },
      });
    }

    // Fallback store
    memoryProducts.unshift(newProduct as (typeof initialProducts)[0]);
    return NextResponse.json({
      success: true,
      source: 'memory',
      product: newProduct,
    });
  } catch (error) {
    console.error('Products API POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}
