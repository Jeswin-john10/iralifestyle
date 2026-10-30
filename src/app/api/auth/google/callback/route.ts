import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findOrCreateGoogleCustomer } from '@/lib/dbStore';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  const state = url.searchParams.get('state');

  let returnTo = '/';
  if (state) {
    try {
      const decoded = JSON.parse(Buffer.from(state, 'base64url').toString('utf-8'));
      if (decoded?.returnTo && typeof decoded.returnTo === 'string') {
        returnTo = decoded.returnTo;
      }
    } catch {
      // ignore state parsing issues
    }
  }

  const protocol = request.headers.get('x-forwarded-proto') || (url.protocol.replace(':', '') || 'http');
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || url.host;
  const baseUrl = `${protocol}://${host}`;

  if (error) {
    console.error('Google OAuth error returned from Google:', error);
    const redirectUrl = new URL('/login', baseUrl);
    redirectUrl.searchParams.set('auth_error', error);
    return NextResponse.redirect(redirectUrl.toString());
  }

  if (!code) {
    const redirectUrl = new URL('/login', baseUrl);
    redirectUrl.searchParams.set('auth_error', 'no_code_provided');
    return NextResponse.redirect(redirectUrl.toString());
  }

  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Missing Google OAuth client credentials');
    const redirectUrl = new URL('/login', baseUrl);
    redirectUrl.searchParams.set('auth_error', 'server_credentials_missing');
    return NextResponse.redirect(redirectUrl.toString());
  }

  try {
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${baseUrl}/api/auth/google/callback`;

    // Exchange authorization code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('Failed to exchange Google code:', tokenData);
      const redirectUrl = new URL('/login', baseUrl);
      redirectUrl.searchParams.set('auth_error', tokenData.error_description || tokenData.error || 'token_exchange_failed');
      return NextResponse.redirect(redirectUrl.toString());
    }

    // Fetch user profile from Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userRes.ok) {
      throw new Error('Failed to retrieve user profile from Google');
    }

    const googleUser = await userRes.json();
    // googleUser: { sub, name, given_name, family_name, picture, email, email_verified }

    // Upsert customer in MongoDB database
    const customer = await findOrCreateGoogleCustomer({
      googleId: googleUser.sub,
      name: googleUser.name || `${googleUser.given_name || ''} ${googleUser.family_name || ''}`.trim() || 'Valued Client',
      email: googleUser.email,
      avatar: googleUser.picture,
    });

    // Store secure session cookie
    const cookieStore = await cookies();
    const sessionData = JSON.stringify(customer);

    cookieStore.set('ira_customer_session', sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days persistent customer session
      path: '/',
    });

    // Also set client accessible auth flag cookie
    cookieStore.set('ira_customer_active', '1', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    const finalRedirectUrl = new URL(returnTo.startsWith('/') ? returnTo : '/', baseUrl);
    finalRedirectUrl.searchParams.set('auth_success', '1');
    finalRedirectUrl.searchParams.set('auth_name', encodeURIComponent(customer.name));

    return NextResponse.redirect(finalRedirectUrl.toString());
  } catch (err) {
    console.error('Google OAuth callback unexpected error:', err);
    const redirectUrl = new URL('/login', baseUrl);
    redirectUrl.searchParams.set('auth_error', (err as Error).message || 'unexpected_error');
    return NextResponse.redirect(redirectUrl.toString());
  }
}
