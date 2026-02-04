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

    const { name, level, description, is_active } = await request.json();

    if (!name || !level) {
      return NextResponse.json({ message: 'Name and level are required' }, { status: 400 });
    }

    const result = await queryWithTenant(
      tenantName,
      'UPDATE positions SET name = $1, level = $2, description = $3, is_active = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
      [name, level, description, is_active, id]
    );

    if (result.length === 0) {
      return NextResponse.json({ message: 'Position not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Position updated successfully', position: result[0] });
  } catch (error) {
    console.error('Error updating position:', error);
    return NextResponse.json({ message: 'Failed to update position' }, { status: 500 });
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
      'SELECT id FROM users WHERE position_id = $1 AND is_active = true',
      [id]
    );

    if (users.length > 0) {
      // Soft delete: set is_active to false
      await queryWithTenant(
        tenantName,
        'UPDATE positions SET is_active = false, updated_at = NOW() WHERE id = $1',
        [id]
      );
      return NextResponse.json({
        message: 'Position is being used, status changed to inactive',
        soft_deleted: true
      });
    }

    // Hard delete if not used
    await queryWithTenant(tenantName, 'DELETE FROM positions WHERE id = $1', [id]);

    return NextResponse.json({ message: 'Position deleted successfully', soft_deleted: false });
  } catch (error) {
    console.error('Error deleting position:', error);
    return NextResponse.json({ message: 'Failed to delete position' }, { status: 500 });
  }
}