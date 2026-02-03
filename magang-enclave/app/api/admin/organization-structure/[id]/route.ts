import { NextRequest, NextResponse } from 'next/server';
import { queryWithTenant } from '@/lib/db';
import { getTenantFromRequest } from '@/lib/server-auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json({ message: 'Unauthorized: Tenant not found' }, { status: 401 });
    }

    const { position_id, name, phone, email } = await request.json();
    const id = params.id;

    if (!position_id || !name || !phone || !email) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    const query = `
      UPDATE organization_structure
      SET position_id = $1, name = $2, phone = $3, email = $4
      WHERE id = $5 AND is_active = true
      RETURNING id
    `;

    const result = await queryWithTenant(tenantName, query, [position_id, name, phone, email, id]);

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Organization structure not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Organization structure updated successfully'
    });
  } catch (error) {
    console.error('Error updating organization structure:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update organization structure' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json({ message: 'Unauthorized: Tenant not found' }, { status: 401 });
    }

    const id = params.id;

    const query = `
      UPDATE organization_structure
      SET is_active = false
      WHERE id = $1
      RETURNING id
    `;

    const result = await queryWithTenant(tenantName, query, [id]);

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Organization structure not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Organization structure deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting organization structure:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete organization structure' },
      { status: 500 }
    );
  }
}
