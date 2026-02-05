export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';

// Public paths yang bisa diakses tanpa autentikasi
const publicPaths = [
  '/login',
  '/lupa-password',
  '/reset-password',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/refresh',
  '/api/auth/me',
  '/api/auth/reset-password',
  '/api/auth/forgot-password',
  '/_next',
  '/favicon.ico',
  '/api/test-email'
];

// Mapping role ke API paths yang diperbolehkan
const roleApiMapping: Record<string, string[]> = {
  'superadmin': [
    '/api/admin',
  ],
  'admin': [
    '/api/admin',
    '/api/user'
  ],
  'general': [
    '/api/admin/templates',
    '/api/user',
  ],
  'approver': [
    '/api/approver',
    '/api/user'
  ],
  'director': [
    '/api/direktur',
    '/api/user',
    '/api/approver'
  ],
  'secretary': [
    '/api/adk',
    '/api/user'
  ]
};

// Function untuk check API access
function hasApiAccess(role: string, pathname: string): boolean {
  const allowedPaths = roleApiMapping[role] || [];
  
  // Check jika path adalah API route
  if (!pathname.startsWith('/api/')) {
    return true; 
  }
  
  // Check jika role memiliki akses ke API path ini
  return allowedPaths.some(allowedPath => pathname.startsWith(allowedPath));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log(`[Middleware] Accessing path: ${pathname}`);

  // Allow public paths
  if (publicPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check token
  const token = request.cookies.get('token')?.value;

  if (!token) {
    console.log('[Middleware] No token found, redirecting to login.');
    
    // Jika API request, return 401 instead of redirect
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }
    
    return NextResponse.redirect(new URL('/login', request.url));
  }

  console.log('[Middleware] Token found:', token.substring(0, 20) + '...');

  try {
    const payload = verifyToken(token);
    
    console.log('[Middleware] Token verified successfully. Payload:', payload);

    // Normalisasi path untuk case-insensitive comparison
    const normalizedPath = pathname.toLowerCase();

    // ============ CHECK API ACCESS ============
    if (pathname.startsWith('/api/')) {
      if (!hasApiAccess(payload.role, pathname)) {
        console.log(`[Middleware] API access denied. Role: ${payload.role}, Path: ${pathname}`);
        return NextResponse.json(
          { 
            error: 'Forbidden - Insufficient permissions',
            message: `Role '${payload.role}' tidak memiliki akses ke ${pathname}`
          },
          { status: 403 }
        );
      }
      console.log(`[Middleware] API access granted. Role: ${payload.role}, Path: ${pathname}`);
      return NextResponse.next();
    }

    // ============ CHECK PAGE ACCESS ============
    
    // Superadmin routes
    if (normalizedPath.startsWith('/dashboard-superadmin') && payload.role !== 'superadmin') {
      console.log('[Middleware] Role mismatch for /dashboard-superadmin. Redirecting.');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Admin routes (exclude dashboard-superadmin)
    if (pathname.startsWith('/admin') && !normalizedPath.startsWith('/dashboard-superadmin') && payload.role !== 'admin') {
      console.log('[Middleware] Role mismatch for /admin. Redirecting.');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // User/General routes
    if (pathname.startsWith('/user') && payload.role !== 'general') {
      console.log('[Middleware] Role mismatch for /user. Redirecting.');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Approver routes
    if (pathname.startsWith('/approver') && payload.role !== 'approver') {
      console.log('[Middleware] Role mismatch for /approver. Redirecting.');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Director routes
    if (pathname.startsWith('/direktur') && payload.role !== 'director') {
      console.log('[Middleware] Role mismatch for /direktur. Redirecting.');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Secretary/ADK routes
    if (pathname.startsWith('/adk') && payload.role !== 'secretary') {
      console.log('[Middleware] Role mismatch for /adk. Redirecting.');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    console.log('[Middleware] Access granted. Proceeding to next.');
    return NextResponse.next();
    
  } catch (error) {
    console.error('[Middleware] Token verification failed. Error:', error instanceof Error ? error.message : String(error));
    
    // Jika API request, return 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }
    
    // Jika page request, redirect ke login dan clear token
    const res = NextResponse.redirect(new URL('/login', request.url));
    res.cookies.set('token', '', { maxAge: 0, path: '/' });
    return res;
  }
}