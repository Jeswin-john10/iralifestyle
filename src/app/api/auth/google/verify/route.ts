import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findOrCreateGoogleCustomer } from '@/lib/dbStore';

export async function POST(request: Request) {
  try {
    const { credential } = await request.json();

    if (!credential) {
      return NextResponse.json({ success: false, error: 'Credential token is required' }, { status: 400 });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    // Verify token with Google's public tokeninfo endpoint
    const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
    if (!verifyRes.ok) {
      const errData = await verifyRes.text();
      console.error('Google tokeninfo verification failed:', errData);
      return NextResponse.json({ success: false, error: 'Invalid Google credential token' }, { status: 401 });
    }

    const payload = await verifyRes.json();

    // Verify audience matches our Client ID
    if (clientId && payload.aud !== clientId) {
      console.error('Google token aud mismatch:', payload.aud, 'expected:', clientId);
      return NextResponse.json({ success: false, error: 'Google Client ID verification mismatch' }, { status: 403 });
    }

    // Upsert customer in database
    const customer = await findOrCreateGoogleCustomer({
      googleId: payload.sub,
      name: payload.name || payload.email?.split('@')[0] || 'Valued Client',
      email: payload.email,
      avatar: payload.picture,
    });

    // Store session cookie
    const cookieStore = await cookies();
    cookieStore.set('ira_customer_session', JSON.stringify(customer), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    cookieStore.set('ira_customer_active', '1', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      user: customer,
      message: `Welcome back, ${customer.name}`,
    });
  } catch (error) {
    console.error('Error verifying Google credential:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
