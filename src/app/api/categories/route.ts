import { NextResponse } from 'next/server';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/dbStore';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ success: true, count: categories.length, categories });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ success: false, message: 'Category name is required' }, { status: 400 });
    }
    const newCat = await createCategory(body);
    return NextResponse.json({ success: true, category: newCat }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const idOrSlug = body.id || body.slug;
    if (!idOrSlug) {
      return NextResponse.json({ success: false, message: 'Category id or slug is required' }, { status: 400 });
    }
    const updated = await updateCategory(idOrSlug, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, category: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let idOrSlug = searchParams.get('id') || searchParams.get('slug');

    if (!idOrSlug) {
      try {
        const body = await request.json();
        idOrSlug = body.id || body.slug;
      } catch {
        // empty body
      }
    }

    if (!idOrSlug) {
      return NextResponse.json({ success: false, message: 'Category id or slug is required' }, { status: 400 });
    }

    const deleted = await deleteCategory(idOrSlug);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
