import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCustomerById, updateCustomerProfile } from '@/lib/dbStore';
import { CustomerUser } from '@/types';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('ira_customer_session');

    if (!sessionCookie?.value) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    let sessionUser: CustomerUser;
    try {
      sessionUser = JSON.parse(sessionCookie.value);
    } catch {
      return NextResponse.json({ authenticated: false, user: null });
    }

    if (sessionUser?.id) {
      const liveUser = await getCustomerById(sessionUser.id);
      if (liveUser) {
        return NextResponse.json({ authenticated: true, user: liveUser });
      }
    }

    return NextResponse.json({ authenticated: true, user: sessionUser });
  } catch (error) {
    console.error('Error fetching current customer session:', error);
    return NextResponse.json({ authenticated: false, user: null, error: (error as Error).message });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('ira_customer_session');

    if (!sessionCookie?.value) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let sessionUser: CustomerUser;
    try {
      sessionUser = JSON.parse(sessionCookie.value);
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 });
    }

    const updates = await request.json();
    const updated = await updateCustomerProfile(sessionUser.id, updates);

    const merged = { ...sessionUser, ...updates, ...(updated || {}) };

    cookieStore.set('ira_customer_session', JSON.stringify(merged), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return NextResponse.json({ success: true, user: merged });
  } catch (error) {
    console.error('Error updating customer profile:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
