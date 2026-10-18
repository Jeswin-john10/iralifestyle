import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ProductModel } from '@/models/Product';
import { initialProducts } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await connectToDatabase();

    if (db) {
      const product = await ProductModel.findOne({
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { id }, { slug: id }],
      }).lean();

      if (product) {
        return NextResponse.json({
          success: true,
          product: { ...product, id: product._id?.toString() || product.id },
        });
      }
    }

    // Fallback search
    const found = initialProducts.find(
      (p) => p.id === id || p.slug === id
    );

    if (found) {
      return NextResponse.json({ success: true, product: found });
    }

    return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
  } catch (error) {
    console.error('Product GET Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await connectToDatabase();

    if (db) {
      await ProductModel.deleteOne({
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { id }, { slug: id }],
      });
    }

    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Product DELETE Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
