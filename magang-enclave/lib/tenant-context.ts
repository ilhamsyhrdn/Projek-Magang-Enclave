
// lib/tenant-context.ts - Helper untuk mendapatkan tenant dari request
import { NextRequest } from 'next/server';
import { headers } from 'next/headers';

export async function getTenantFromRequest(request?: NextRequest): Promise<string> {
  if (request) {
    return request.headers.get('x-tenant-name') || 'himatif';
  }
  
  // For server components
  const headersList = await headers();
  return headersList.get('x-tenant-name') || 'himatif';
}

export async function getUserIdFromRequest(request?: NextRequest): Promise<number> {
  if (request) {
    return parseInt(request.headers.get('x-user-id') || '0');
  }
  
  const headersList = await headers();
  return parseInt(headersList.get('x-user-id') || '0');
}

export async function getUserRoleFromRequest(request?: NextRequest): Promise<string> {
  if (request) {
    return request.headers.get('x-user-role') || 'general';
  }
  
  const headersList = await headers();
  return headersList.get('x-user-role') || 'general';
}