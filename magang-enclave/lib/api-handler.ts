// lib/api-handler.ts - Wrapper untuk API routes dengan tenant context
import { NextRequest, NextResponse } from 'next/server';
import { queryWithTenant } from './db';

export interface TenantRequest extends NextRequest {
  tenantName: string;
  userId: number;
  userRole: string;
}

export type APIHandler = (
  request: TenantRequest,
  context?: any
) => Promise<NextResponse>;

export function withTenant(handler: APIHandler) {
  return async (request: NextRequest, context?: any) => {
    try {
      const tenantName = getTenantFromRequest(request);
      const userId = getUserIdFromRequest(request);
      const userRole = getUserRoleFromRequest(request);

      if (!tenantName || !userId) {
        return NextResponse.json(
          { message: 'Unauthorized - Missing tenant context' },
          { status: 401 }
        );
      }

      const tenantRequest = Object.assign(request, {
        tenantName,
        userId,
        userRole,
      }) as TenantRequest;

      return await handler(tenantRequest, context);
    } catch (error) {
      console.error('API Error:', error);
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}
function getUserIdFromRequest(request: NextRequest): number {
    const userId = request.headers.get('x-user-id');
    return userId ? parseInt(userId, 10) : 0;
}

function getUserRoleFromRequest(request: NextRequest): string {
    return request.headers.get('x-user-role') || '';
}

function getTenantFromRequest(request: NextRequest): string {
    return request.headers.get('x-tenant-name') || '';
}
