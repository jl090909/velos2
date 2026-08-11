import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('veloshield_auth');
  const { pathname } = request.nextUrl;

  // Allow login page and assets through
  if (pathname === '/login' || pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname === '/veloshield-logo.svg') {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!authCookie || authCookie.value !== 'true') {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|ot-hero.jpeg|shutterstock).*)'],
};
