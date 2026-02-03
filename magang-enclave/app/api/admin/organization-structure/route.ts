import { NextRequest, NextResponse } from 'next/server';
import { queryWithTenant } from '@/lib/db';
import { getTenantFromRequest } from '@/lib/server-auth';

export async function GET(request: NextRequest) {
  try {
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json({ message: 'Unauthorized: Tenant not found' }, { status: 401 });
    }

    const query = `
      SELECT 
        os.id,
        os.position_id,
        p.name as position_name,
        os.name,
        os.phone,
        os.email
      FROM organization_structure os
      LEFT JOIN positions p ON os.position_id = p.id
      WHERE os.is_active = true
      ORDER BY p.name, os.name
    `;

    const result = await queryWithTenant(tenantName, query);

    return NextResponse.json({ 
      success: true, 
      data: result.rows 
    });
  } catch (error) {
    console.error('Error fetching organization structure:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch organization structure' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json({ message: 'Unauthorized: Tenant not found' }, { status: 401 });
    }

    const { position_id, name, phone, email } = await request.json();

    if (!position_id || !name || !phone || !email) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO organization_structure (position_id, name, phone, email, is_active)
      VALUES ($1, $2, $3, $4, true)
      RETURNING id
    `;

    const result = await queryWithTenant(tenantName, query, [position_id, name, phone, email]);

    return NextResponse.json({
      success: true,
      message: 'Organization structure created successfully',
      data: result.rows[0]
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating organization structure:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create organization structure' },
      { status: 500 }
    );
  }
}
