import { NextRequest, NextResponse } from 'next/server';
import { queryWithTenant } from '@/lib/db';
import { getTenantFromRequest } from '@/lib/server-auth';

export async function GET(request: NextRequest) {
  try {
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json({ message: 'Unauthorized: Tenant not found' }, { status: 401 });
    }

    const positions = await queryWithTenant(
      tenantName,
      'SELECT id, name, level, description, is_active FROM positions ORDER BY created_at ASC'
    );

    return NextResponse.json({ positions });
  } catch (error) {
    console.error('Error fetching positions:', error);
    return NextResponse.json({ message: 'Failed to fetch positions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json({ message: 'Unauthorized: Tenant not found' }, { status: 401 });
    }

    const { name, level, description } = await request.json();

    if (!name || !level) {
      return NextResponse.json({ message: 'Name and level are required' }, { status: 400 });
    }

    const result = await queryWithTenant(
      tenantName,
      'INSERT INTO positions (name, level, description) VALUES ($1, $2, $3) RETURNING *',
      [name, level, description]
    );

    return NextResponse.json({ message: 'Position created successfully', position: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating position:', error);
    return NextResponse.json({ message: 'Failed to create position' }, { status: 500 });
  }
}