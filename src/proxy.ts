import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect Admin Dashboard routes
  if (pathname.startsWith('/admin/dashboard')) {
    const session = request.cookies.get('ira_admin_session');

    if (!session || session.value !== 'authenticated_admin_ira_2026') {
      const loginUrl = new URL('/admin/ira/login', request.url);
      loginUrl.searchParams.set('reason', 'unauthorized');
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
};
