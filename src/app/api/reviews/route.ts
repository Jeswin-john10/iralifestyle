import { NextResponse } from 'next/server';
import { createReview, getReviews, deleteReview, updateReviewStatus } from '@/lib/dbStore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId') || undefined;
    const reviews = await getReviews(productId);
    return NextResponse.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.productId || !body.customerName || !body.comment || !body.rating) {
      return NextResponse.json(
        { success: false, message: 'productId, customerName, rating, and comment are required' },
        { status: 400 }
      );
    }
    const review = await createReview({
      productId: body.productId,
      productTitle: body.productTitle || 'IRA Royal Garment',
      productImage: body.productImage || '',
      customerName: body.customerName,
      customerEmail: body.customerEmail || '',
      rating: Number(body.rating),
      comment: body.comment,
    });
    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Review id is required' }, { status: 400 });
    }
    const success = await deleteReview(id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, message: 'id and status are required' }, { status: 400 });
    }
    const success = await updateReviewStatus(id, status);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
