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

    const { name, code, division_id, is_active } = await request.json();

    if (!name || !code || !division_id) {
      return NextResponse.json({ message: 'Name, code, and division are required' }, { status: 400 });
    }

    const result = await queryWithTenant(
      tenantName,
      'UPDATE departments SET name = $1, code = $2, division_id = $3, is_active = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
      [name, code, division_id, is_active, id]
    );

    if (result.length === 0) {
      return NextResponse.json({ message: 'Department not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Department updated successfully', department: result[0] });
  } catch (error) {
    console.error('Error updating department:', error);
    return NextResponse.json({ message: 'Failed to update department' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json({ message: 'Unauthorized: Tenant not found' }, { status: 401 });
    }

    const users = await queryWithTenant(
      tenantName,
      'SELECT id FROM users WHERE department_id = $1 AND is_active = true',
      [id]
    );

    if (users.length > 0) {
      // Soft delete: set is_active to false
      await queryWithTenant(
        tenantName,
        'UPDATE departments SET is_active = false, updated_at = NOW() WHERE id = $1',
        [id]
      );
      return NextResponse.json({ 
        message: 'Department is being used, status changed to inactive',
        soft_deleted: true
      });
    }

    // Hard delete if not used
    await queryWithTenant(tenantName, 'DELETE FROM departments WHERE id = $1', [id]);

    return NextResponse.json({ message: 'Department deleted successfully', soft_deleted: false });
  } catch (error) {
    console.error('Error deleting department:', error);
    return NextResponse.json({ message: 'Failed to delete department' }, { status: 500 });
  }
}