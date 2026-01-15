import { NextRequest, NextResponse } from 'next/server';
import { queryWithTenant } from '@/lib/db';
import { getTenantFromRequest } from '@/lib/server-auth';

export async function GET(request: NextRequest) {
  try {
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json({ message: 'Unauthorized: Tenant not found' }, { status: 401 });
    }

    const departments = await queryWithTenant(
      tenantName,
      `
        SELECT 
          d.id, 
          d.name, 
          d.code, 
          d.division_id, 
          d.is_active, 
          div.name as division_name 
        FROM departments d
        JOIN divisions div ON d.division_id = div.id
        ORDER BY d.created_at ASC
      `
    );

    return NextResponse.json({ departments });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json({ message: 'Failed to fetch departments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json({ message: 'Unauthorized: Tenant not found' }, { status: 401 });
    }

    const { name, code, division_id } = await request.json();

    if (!name || !code || !division_id) {
      return NextResponse.json({ message: 'Name, code, and division are required' }, { status: 400 });
    }

    const result = await queryWithTenant(
      tenantName,
      'INSERT INTO departments (name, code, division_id) VALUES ($1, $2, $3) RETURNING *',
      [name, code, division_id]
    );

    return NextResponse.json({ message: 'Department created successfully', department: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating department:', error);
    return NextResponse.json({ message: 'Failed to create department' }, { status: 500 });
  }
}