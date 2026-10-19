import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const expectedUser = process.env.ADMIN_USERNAME || 'admin';
    const expectedPass = process.env.ADMIN_PASSWORD || 'ira@lifestyle2026';

    if (username === expectedUser && password === expectedPass) {
      const cookieStore = await cookies();
      cookieStore.set('ira_admin_session', 'authenticated_admin_ira_2026', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return NextResponse.json({
        success: true,
        message: 'Welcome to IRA Lifestyle Admin',
        user: { username, role: 'Super Admin' }
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid administrative credentials'
    }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('ira_admin_session');
  return NextResponse.json({ success: true, message: 'Logged out successfully' });
}
