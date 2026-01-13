// middleware.ts (di root project)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './jwt';

export function middleware(request: NextRequest) {
  // Path yang tidak perlu authentikasi
  const publicPaths = ['/login', '/register', '/api/auth/login', '/api/auth/register'];
  
  if (publicPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  // Ambil token dari cookie atau header
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  try {
    const payload = verifyToken(token);
    
    // Tambahkan tenant info ke headers untuk digunakan di API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-tenant-name', payload.tenantName);
    requestHeaders.set('x-user-id', payload.userId.toString());
    requestHeaders.set('x-user-role', payload.role);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};