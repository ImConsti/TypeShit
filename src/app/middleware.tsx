import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;
  const path = request.nextUrl.pathname;

  const isPublicRoute = path === '/login' || path === '/register' || path === '/forgot-password';

  if (!authToken && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (authToken && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};