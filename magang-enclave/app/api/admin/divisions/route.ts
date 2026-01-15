import { NextRequest, NextResponse } from 'next/server';
import { queryWithTenant } from '@/lib/db';
import { getTenantFromRequest } from '@/lib/server-auth';

export async function GET(request: NextRequest) {
  try {
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json({ message: 'Unauthorized: Tenant not found' }, { status: 401 });
    }

    const divisions = await queryWithTenant(
      tenantName,
      'SELECT id, name, code, is_active FROM divisions ORDER BY created_at ASC'
    );

    return NextResponse.json({ divisions });
  } catch (error) {
    console.error('Error fetching divisions:', error);
    return NextResponse.json({ message: 'Failed to fetch divisions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json({ message: 'Unauthorized: Tenant not found' }, { status: 401 });
    }

    const { name, code } = await request.json();

    if (!name || !code) {
      return NextResponse.json({ message: 'Name and code are required' }, { status: 400 });
    }

    const result = await queryWithTenant(
      tenantName,
      'INSERT INTO divisions (name, code) VALUES ($1, $2) RETURNING *',
      [name, code]
    );

    return NextResponse.json({ message: 'Division created successfully', division: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating division:', error);
    return NextResponse.json({ message: 'Failed to create division' }, { status: 500 });
  }
}