import { NextResponse } from 'next/server';
import { addNewsletterSubscriber, getNewsletterSubscribers, deleteNewsletterSubscriber } from '@/lib/dbStore';

export async function GET() {
  try {
    const subscribers = await getNewsletterSubscribers();
    return NextResponse.json({ success: true, count: subscribers.length, subscribers });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, message: 'Valid email is required' }, { status: 400 });
    }
    await addNewsletterSubscriber(email);
    return NextResponse.json({ success: true, message: 'Thank you for subscribing to IRA Lifestyle!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }
    const success = await deleteNewsletterSubscriber(email);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
