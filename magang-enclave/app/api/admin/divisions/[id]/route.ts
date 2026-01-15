import { NextRequest, NextResponse } from 'next/server';
import { queryWithTenant } from '@/lib/db';
import { getTenantFromRequest } from '@/lib/server-auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json({ message: 'Unauthorized: Tenant not found' }, { status: 401 });
    }

    const { name, code, is_active } = await request.json();

    if (!name || !code) {
      return NextResponse.json({ message: 'Name and code are required' }, { status: 400 });
    }

    const result = await queryWithTenant(
      tenantName,
      'UPDATE divisions SET name = $1, code = $2, is_active = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
      [name, code, is_active, id]
    );

    if (result.length === 0) {
      return NextResponse.json({ message: 'Division not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Division updated successfully', division: result[0] });
  } catch (error) {
    console.error('Error updating division:', error);
    return NextResponse.json({ message: 'Failed to update division' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json({ message: 'Unauthorized: Tenant not found' }, { status: 401 });
    }

    const departments = await queryWithTenant(
      tenantName,
      'SELECT id FROM departments WHERE division_id = $1',
      [id]
    );

    if (departments.length > 0) {
      return NextResponse.json({ message: 'Cannot delete division, it is being used by a department' }, { status: 400 });
    }

    await queryWithTenant(tenantName, 'DELETE FROM divisions WHERE id = $1', [id]);

    return NextResponse.json({ message: 'Division deleted successfully' });
  } catch (error) {
    console.error('Error deleting division:', error);
    return NextResponse.json({ message: 'Failed to delete division' }, { status: 500 });
  }
}