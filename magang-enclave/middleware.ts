export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';

const publicPaths = [
  '/login',
  '/lupa-password',
  '/reset-password',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/refresh',
  '/_next',
  '/favicon.ico',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log(`[Middleware] Accessing path: ${pathname}`);

  if (publicPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  if (!token) {
    console.log('[Middleware] No token found, redirecting to login.');
    return NextResponse.redirect(new URL('/login', request.url));
  }
  console.log('[Middleware] Token found:', token.substring(0, 20) + '...');

  try {
    const payload = verifyToken(token);
    
    console.log('[Middleware] Token verified successfully. Payload:', payload);

    if (pathname.startsWith('/dashboard-superadmin') && payload.role !== 'superadmin') {
      console.log('[Middleware] Role mismatch for /dashboard-superadmin. Redirecting.');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (pathname.startsWith('/admin') && payload.role !== 'admin') {
      console.log('[Middleware] Role mismatch for /admin. Redirecting.');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (pathname.startsWith('/user') && payload.role !== 'general') {
      console.log('[Middleware] Role mismatch for /user. Redirecting.');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (pathname.startsWith('/approver') &&
        !['approver', 'secretary'].includes(payload.role)) {
      console.log('[Middleware] Role mismatch for /approver. Redirecting.');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    console.log('[Middleware] Access granted. Proceeding to next.');
    return NextResponse.next();
  } catch (error) {
    console.error('[Middleware] Token verification failed. Error:', error instanceof Error ? error.message : String(error));
    const res = NextResponse.redirect(new URL('/login', request.url));
    res.cookies.set('token', '', { maxAge: 0, path: '/' });
    return res;
  }
}
