import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const returnTo = url.searchParams.get('redirect') || '/';

    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      return NextResponse.json(
        { error: 'Google Client ID is not configured in environment variables' },
        { status: 500 }
      );
    }

    // Determine base redirect URI
    const protocol = request.headers.get('x-forwarded-proto') || (url.protocol.replace(':', '') || 'http');
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || url.host;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${protocol}://${host}/api/auth/google/callback`;

    const statePayload = Buffer.from(JSON.stringify({ returnTo, timestamp: Date.now() })).toString('base64url');

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid email profile');
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'select_account');
    authUrl.searchParams.set('state', statePayload);

    return NextResponse.redirect(authUrl.toString());
  } catch (error) {
    console.error('Google OAuth initialization error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
