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

    const { employee_id, full_name, email, password, division_id, department_id, position_id, role, is_active } = await request.json();

    if (!employee_id || !full_name || !email || !division_id || !department_id || !position_id || !role) {
      return NextResponse.json({ message: 'Required fields are missing' }, { status: 400 });
    }

    const currentUser = await queryWithTenant(tenantName, 'SELECT email FROM users WHERE id = $1', [id]);
    if (currentUser.length > 0 && currentUser[0].email !== email) {
      const emailExists = await queryWithTenant(tenantName, 'SELECT id FROM users WHERE email = $1 AND id != $2', [email, id]);
      if (emailExists.length > 0) {
        return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
      }
    }

    let query = `
      UPDATE users 
      SET employee_id = $1, full_name = $2, email = $3, division_id = $4, department_id = $5, position_id = $6, role = $7, is_active = $8, updated_at = NOW()
    `;
    let queryParams = [employee_id, full_name, email, division_id, department_id, position_id, role, is_active];
    
    if (password) {
      query += `, password_hash = $9 WHERE id = $10 RETURNING *`;
      queryParams.push(password, id);
    } else {
      query += ` WHERE id = $9 RETURNING *`;
      queryParams.push(id);
    }

    const result = await queryWithTenant(tenantName, query, queryParams);

    if (result.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User updated successfully', user: result[0] });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json({ message: 'Unauthorized: Tenant not found' }, { status: 401 });
    }

    await queryWithTenant(tenantName, 'DELETE FROM users WHERE id = $1', [id]);

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Failed to delete user' }, { status: 500 });
  }
}