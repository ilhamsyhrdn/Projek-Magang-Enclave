import { verifyToken } from '@/lib/jwt';
import { NextRequest } from 'next/server';

/**
 * Mengekstrak tenantName dari token JWT di cookie request.
 * @param request - Objek request dari Next.js API Route.
 * @returns Nama tenant atau null jika tidak ada/token tidak valid.
 */
export async function getTenantFromRequest(request: NextRequest): Promise<string | null> {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    console.error('No token found in request.');
    return null;
  }

  try {
    const payload = verifyToken(token);
    return payload.tenantName;
  } catch (error) {
    console.error('Error verifying token in getTenantFromRequest:', error);
    return null;
  }
}