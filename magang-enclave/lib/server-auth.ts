import { NextRequest } from 'next/server';
import { verifyToken } from './jwt';

/**
 * Get tenant name from JWT token
 */
export async function getTenantFromRequest(request: NextRequest): Promise<string | null> {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return null;
    }

    const payload = verifyToken(token);
    return payload.tenantName || null;
  } catch (error) {
    console.error('[Server Auth] Error getting tenant:', error);
    return null;
  }
}

/**
 * Get user info from JWT token
 */
export async function getUserFromRequest(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return null;
    }

    const payload = verifyToken(token);
    return payload;
  } catch (error) {
    console.error('[Server Auth] Error getting user:', error);
    return null;
  }
}
