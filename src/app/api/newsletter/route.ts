import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { SubscriberModel } from '@/models/Subscriber';

const memorySubscribers: string[] = [];

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid email required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    if (db) {
      await SubscriberModel.updateOne(
        { email: email.toLowerCase() },
        { email: email.toLowerCase(), source: 'homepage' },
        { upsert: true }
      );
    } else {
      if (!memorySubscribers.includes(email.toLowerCase())) {
        memorySubscribers.push(email.toLowerCase());
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for joining the IRA Lifestyle family!',
    });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ success: false, error: 'Subscription failed' }, { status: 500 });
  }
}
