import { NextResponse } from 'next/server';
import { createInquiry, getInquiries, deleteInquiry } from '@/lib/dbStore';

export async function GET() {
  try {
    const inquiries = await getInquiries();
    return NextResponse.json({ success: true, count: inquiries.length, inquiries });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ success: false, message: 'Name, email, and message are required' }, { status: 400 });
    }
    const inquiry = await createInquiry({
      name: body.name,
      email: body.email,
      phone: body.phone,
      subject: body.subject,
      message: body.message,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Inquiry ID is required' }, { status: 400 });
    }
    const success = await deleteInquiry(id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
